<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    protected $table = 'order_items';

    protected $guarded = [];

    protected $casts = [
      'taxable' => 'boolean',
      'requires_shipping' => 'boolean',
    ];

    public function order()
    {
        return $this->belongsTo(Orders::class, 'order_uuid', 'uuid');
    }
}
