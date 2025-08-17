<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait UuidTrait
{
    /**
     * Boot function from Laravel.
     */
    protected static function bootUuidTrait()
    {
        static::creating(function ($model) {
            if (! $model->uuid) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public static function findByUuid($uuid)
    {
        return self::where('uuid', $uuid)->firstOrFail();
    }

    public static function getAccessToken($store_url)
    {
        $data = self::where('store_url', $store_url)->firstOrFail();

        return $data->access_token;
    }
}
