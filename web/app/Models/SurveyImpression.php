<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyImpression extends Model
{
    use UuidTrait;

    protected $fillable = [
        'shopify_customer_id',
        'channel_type',
        'page_type',
        'order_id',
        'dismissed',
        'extra'
    ];

    protected $casts = [
        'extra' => 'array',
        'dismissed' => 'boolean',
        'shopify_customer_id' => 'integer',
        'order_id' => 'integer'
    ];

    // Timestamps are handled manually
    public $timestamps = false;

    // Relationships
    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_uuid', 'uuid');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_uuid', 'uuid');
    }

    public function response(): BelongsTo
    {
        return $this->belongsTo(Response::class, 'response_uuid', 'uuid');
    }
}
