<?php

namespace App\Api\Shopify\Traits;

trait ShopifyHelper
{
    public function getShopId(string $shop_url)
    {
        return str_replace('gid://shopify/Shop/', '', $shop_url);
    }
}
