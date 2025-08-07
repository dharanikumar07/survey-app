<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    use UuidTrait, SoftDeletes;

    protected $fillable = [
        'store_id',
        'name',
        'store_url',
        'access_token',
        'status',
    ];
}
