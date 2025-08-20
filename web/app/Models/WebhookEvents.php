<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookEvents extends Model
{
    use hasFactory, UuidTrait;

    protected $table = 'webhook_events';

    protected $guarded = [];

    protected $casts = [
        'webhook_data' => 'json',
    ];
}
