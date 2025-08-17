<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use SoftDeletes, UuidTrait;

    protected $guarded = [];

    public function getAccessToken()
    {
        return $this->access_token;
    }

    public function getStoreUrl()
    {
        return $this->store_url;
    }
}
