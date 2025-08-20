<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscountCode extends Model
{
    use UuidTrait;

    protected $fillable = [
        'code',
        'shopify_discount_id',
        'customer_email',
        'expires_at',
        'used_at',
        'status',
        'extra'
    ];

    protected $casts = [
        'extra' => 'array',
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'shopify_discount_id' => 'integer'
    ];

    // Relationships
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_uuid', 'uuid');
    }

    public function response(): BelongsTo
    {
        return $this->belongsTo(Response::class, 'response_uuid', 'uuid');
    }
}
