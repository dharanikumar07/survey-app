<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    use UuidTrait;

    protected $fillable = [
        'key',
        'value',
        'extra'
    ];

    protected $casts = [
        'value' => 'array',
        'extra' => 'array'
    ];

    // Relationships
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_uuid', 'uuid');
    }
}
