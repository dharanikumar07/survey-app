<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory,UuidTrait;

    protected $table = 'products';

    protected $guarded = [];

    protected $casts = [
        'is_taxable' => 'boolean',
    ];
}
