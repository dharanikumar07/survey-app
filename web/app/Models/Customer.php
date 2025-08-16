<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory,UuidTrait;

    protected $table = 'customers';

    protected $guarded = [];

    protected $casts = [
        'email_marketing_consent' => 'array',
        'tags' => 'array',
    ];
}
