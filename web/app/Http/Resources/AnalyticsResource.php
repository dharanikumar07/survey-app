<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnalyticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'ratings'  => $this['ratings'],
            'questions' => $this['questions'],
            'surveys'  => $this['surveys'],
            'overall'  => $this['overall'],
        ];
    }
}
