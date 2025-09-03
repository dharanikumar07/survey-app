<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Response extends Model
{
    use UuidTrait;

    protected $table = 'responses';
    protected $guarded = [];

    protected $casts = [
        'answers' => 'array',
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
