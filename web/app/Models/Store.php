<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use SoftDeletes, UuidTrait;

    protected $casts = [
        'sync_status' => 'json',
        'shopify_data' => 'array',
        'extra' => 'array'
    ];

    protected $fillable = [
        'store_id',
        'name',
        'store_url',
        'access_token',
        'status',
        'shopify_data',
        'extra'
    ];

    public function getAccessToken()
    {
        return $this->access_token;
    }

    public function getStoreUrl()
    {
        return $this->store_url;
    }

    public static function getStoreUuidByDomain(string $shop): ?string
    {
        return self::where('store_url', $shop)->value('uuid');
    }

    public static function getStoreByDomain(string $shop)
    {
        return self::where('store_url', $shop)->firstOrFail();
    }

    // Relationships
    public function surveys(): HasMany
    {
        return $this->hasMany(Survey::class, 'store_uuid', 'uuid');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class, 'store_uuid', 'uuid');
    }

    public function impressions(): HasMany
    {
        return $this->hasMany(SurveyImpression::class, 'store_uuid', 'uuid');
    }

    public function settings(): HasMany
    {
        return $this->hasMany(Setting::class, 'store_uuid', 'uuid');
    }

    public function discountCodes(): HasMany
    {
        return $this->hasMany(DiscountCode::class, 'store_uuid', 'uuid');
    }

    public function webhooks(): HasMany
    {
        return $this->hasMany(Webhook::class, 'store_uuid', 'uuid');
    }
}
