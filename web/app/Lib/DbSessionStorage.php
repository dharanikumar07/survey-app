<?php

declare(strict_types=1);

namespace App\Lib;

use App\Api\Shopify\Shop;
use App\Api\Shopify\Traits\ShopifyHelper;
use App\Jobs\sync\SyncCustomers;
use App\Jobs\WebHook;
use App\Models\Store;
use Exception;
use Illuminate\Support\Facades\Log;
use Shopify\Auth\AccessTokenOnlineUserInfo;
use Shopify\Auth\Session;
use Shopify\Auth\SessionStorage;

class DbSessionStorage implements SessionStorage
{
    use ShopifyHelper;

    public function loadSession(string $sessionId): ?Session
    {
        $dbSession = \App\Models\Session::where('session_id', $sessionId)->first();

        if ($dbSession) {
            $toBool = function ($value): bool {
                if (is_bool($value)) {
                    return $value;
                }
                if (is_int($value)) {
                    return $value === 1;
                }
                $stringValue = strtolower((string) $value);

                return in_array($stringValue, ['1', 't', 'true', 'on', 'yes'], true);
            };

            $session = new Session(
                $dbSession->session_id,
                $dbSession->shop,
                $toBool($dbSession->is_online),
                $dbSession->state
            );
            if ($dbSession->expires_at) {
                $session->setExpires($dbSession->expires_at);
            }
            if ($dbSession->access_token) {
                $session->setAccessToken($dbSession->access_token);
            }
            if ($dbSession->scope) {
                $session->setScope($dbSession->scope);
            }
            if ($dbSession->user_id) {
                $onlineAccessInfo = new AccessTokenOnlineUserInfo(
                    (int) $dbSession->user_id,
                    $dbSession->user_first_name,
                    $dbSession->user_last_name,
                    $dbSession->user_email,
                    $dbSession->user_email_verified == 1,
                    $dbSession->account_owner == 1,
                    $dbSession->locale,
                    $dbSession->collaborator == 1
                );
                $session->setOnlineAccessInfo($onlineAccessInfo);
            }

            return $session;
        }

        return null;
    }

    public function storeSession(Session $session): bool
    {
        $dbSession = \App\Models\Session::where('session_id', $session->getId())->first();
        if (! $dbSession) {
            $dbSession = new \App\Models\Session;
        }
        $dbSession->session_id = $session->getId();
        $dbSession->shop = $session->getShop();
        $dbSession->state = $session->getState();
        $dbSession->is_online = $session->isOnline() ? 'true' : 'false';
        $dbSession->access_token = $session->getAccessToken();
        $dbSession->expires_at = $session->getExpires();
        $dbSession->scope = $session->getScope();
        if (! empty($session->getOnlineAccessInfo())) {
            $dbSession->user_id = $session->getOnlineAccessInfo()->getId();
            $dbSession->user_first_name = $session->getOnlineAccessInfo()->getFirstName();
            $dbSession->user_last_name = $session->getOnlineAccessInfo()->getLastName();
            $dbSession->user_email = $session->getOnlineAccessInfo()->getEmail();
            $dbSession->user_email_verified = $session->getOnlineAccessInfo()->isEmailVerified();
            $dbSession->account_owner = $session->getOnlineAccessInfo()->isAccountOwner();
            $dbSession->locale = $session->getOnlineAccessInfo()->getLocale();
            $dbSession->collaborator = $session->getOnlineAccessInfo()->isCollaborator();
        }
        try {
            if (! Store::where('store_url', $session->getShop())->where('access_token', '<>', null)->exists()) {
                $shop = new Shop;
                $shop->initialize($session->getShop(), $session->getAccessToken());
                $shop_data = $shop->getShopDetails();
                $store = Store::create([
                    'store_id' => $this->getShopId($shop_data['id']),
                    'name' => $shop_data['name'],
                    'store_url' => $shop_data['myshopifyDomain'],
                    'access_token' => $session->getAccessToken(),
                    'status' => 'online',
                ]);
            }
            WebHook::dispatch($store);
            SyncCustomers::dispatch($store);
            return $dbSession->save();
        } catch (Exception $err) {
            Log::error('Failed to save session to database: '.$err->getMessage());

            return false;
        }
    }

    public function deleteSession(string $sessionId): bool
    {
        return \App\Models\Session::where('session_id', $sessionId)->delete() === 1;
    }
}
