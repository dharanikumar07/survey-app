<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Survey extends Model
{
    use UuidTrait, SoftDeletes;

    protected $fillable = [
        'name',
        'status',
        'survey_type',
        'questions',
        'channels',
        'thank_you',
        'discount',
        'targeting',
        'design',
        'total_responses',
        'total_impressions',
        'is_active',
        'extra'
    ];

    protected $casts = [
        'questions' => 'array',
        'channels' => 'array',
        'thank_you' => 'array',
        'discount' => 'array',
        'targeting' => 'array',
        'design' => 'array',
        'extra' => 'array',
        'is_active' => 'boolean',
        'total_responses' => 'integer',
        'total_impressions' => 'integer'
    ];

    // Relationships
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_uuid', 'uuid');
    }

    public function responses(): HasMany
    {
        return $this->hasMany(Response::class, 'survey_uuid', 'uuid');
    }

    public function impressions(): HasMany
    {
        return $this->hasMany(SurveyImpression::class, 'survey_uuid', 'uuid');
    }
}
