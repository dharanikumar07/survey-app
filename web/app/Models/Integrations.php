<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;

class Integrations extends Model
{
    use UuidTrait;

    protected $table = 'integrations';

    protected $guarded = [];

    protected $casts = [
      'config' => 'array',
    ];
}
