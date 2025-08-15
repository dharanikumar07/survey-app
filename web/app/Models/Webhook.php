<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Webhook extends Model
{
    use UuidTrait;

    protected $fillable = [
        'url',
        'events',
        'status',
        'last_success_at',
        'extra'
    ];

    protected $casts = [
        'events' => 'array',
        'extra' => 'array',
        'last_success_at' => 'datetime'
    ];

    // Relationships
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_uuid', 'uuid');
    }
}
