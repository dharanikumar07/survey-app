<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Response extends Model
{
    use UuidTrait;

    protected $fillable = [
        'survey_name',
        'shopify_customer_id',
        'customer_email',
        'questions',
        'channel_type',
        'page_type',
        'page_url',
        'order_id',
        'order_name',
        'is_completed',
        'extra'
    ];

    protected $casts = [
        'questions' => 'array',
        'extra' => 'array',
        'is_completed' => 'boolean',
        'shopify_customer_id' => 'integer',
        'order_id' => 'integer'
    ];

    // Relationships
    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_uuid', 'uuid');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_uuid', 'uuid');
    }

    public function impressions(): HasMany
    {
        return $this->hasMany(SurveyImpression::class, 'response_uuid', 'uuid');
    }
}
