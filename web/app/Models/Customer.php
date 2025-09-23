<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory,UuidTrait;

    protected $table = 'customers';

    protected $guarded = [];

    protected $casts = [
        'email_marketing_consent' => 'array',
        'tags' => 'array',
    ];

    public function getName()
    {
        if (!$this->customer) {
            return "John Doe";
        }

        $first = $this->customer['first_name'] ?? "John";
        $last = $this->customer['last_name'] ?? "Doe";

        return $first . ' ' . $last;
    }

    public function getFirstName()
    {
        return $this->customer['first_name'] ?? "John";
    }

    public function getLastName()
    {
        return $this->customer['last_name'] ?? "Doe";
    }
}
