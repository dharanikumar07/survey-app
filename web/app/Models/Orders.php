<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory, UuidTrait;

    protected $table = 'orders';

    protected $guarded = [];

    protected $casts = [
      'taxes_included' => 'boolean'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'order_uuid', 'uuid');
    }
}
