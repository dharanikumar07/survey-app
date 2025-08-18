<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    use HasFactory, UuidTrait;

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
