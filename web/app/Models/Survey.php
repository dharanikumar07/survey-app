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

    public const ONSITE_SURVEY = 'onsite';
    public const POST_PURCHASE_SURVEY = 'post_purchase';

    public const THANK_YOU_PAGE_SURVEY = 'thank_you_page';

    public const SITE_WIDGET = 'site_widget';

    protected $fillable = [
        'name',
        'status',
        'survey_type',
        'survey_meta_data',
        'total_responses',
        'total_impressions',
        'is_active',
        'store_uuid'
    ];

    protected $casts = [
        'survey_meta_data' => 'array',
        'is_active' => 'boolean',
        'total_responses' => 'integer',
        'total_impressions' => 'integer'
    ];

    public function setIsActiveAttribute($value)
    {
        if (is_bool($value)) {
            $this->attributes['is_active'] = $value ? 'true' : 'false';
            return;
        }
        if (is_int($value)) {
            $this->attributes['is_active'] = $value === 1 ? 'true' : 'false';
            return;
        }
        $stringValue = strtolower((string) $value);
        $this->attributes['is_active'] = in_array($stringValue, ['1', 't', 'true', 'on', 'yes'], true) ? 'true' : 'false';
    }

    public function getIsActiveAttribute($value)
    {
        if (is_bool($value)) {
            return $value;
        }
        return strtolower((string) $value) === 'true';
    }

    // Relationships
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class, 'store_uuid', 'uuid');
    }

    public function responses()
    {
        return $this->hasMany(Response::class, 'survey_uuid', 'uuid');
    }

    public function impressions(): HasMany
    {
        return $this->hasMany(SurveyImpression::class, 'survey_uuid', 'uuid');
    }

    public function getChannelConfigType()
    {
        return $this->survey_meta_data['channels']['onsite']['config']['pageTargeting'] ?? 'all';
    }

    public function getExcludePages()
    {
        return $this->survey_meta_data['channels']['onsite']['config']['excludedPageTypes'] ?? [];
    }

    public function getExcludePageTrueOrNot()
    {
        return $this->survey_meta_data['channels']['onsite']['config']['excludePages'] ?? false;
    }

    public function getDiscountEnabledOrNot()
    {
        return $this->survey_meta_data['discount']['enabled'] ?? false;
    }

    public function getDiscountValue()
    {
        return $this->survey_meta_data['discount']['discount_value'] ?? 'percentage';
    }

    public function getDiscountType()
    {
        return $this->survey_meta_data['discount']['discount_type'] ?? 'generic';
    }

    public function getDiscountValueAmount()
    {
        return $this->survey_meta_data['discount']['discount_value_amount'] ?? 5;
    }

    public function getIntegrationKlaviyoEnabled()
    {
        return $this->survey_meta_data['integrations']['klaviyo']["enabled"] ?? false;
    }

    public function getIntegrationKlaviyoListId()
    {
        return $this->survey_meta_data['integrations']['klaviyo']["listId"] ?? null;
    }

    public function isEmailDataPresent()
    {
        return $this->survey_meta_data['channels']['post_purchase_email']['enabled'] ?? false;
    }

    public function getEmailData()
    {
        return $this->survey_meta_data['channels']['post_purchase_email']['email_data'] ?? [];
    }

    public function getSurveyLink()
    {
        return $this->survey_meta_data['channels']['branded_survey'] ?? '';
    }
}
