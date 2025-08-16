<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
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
