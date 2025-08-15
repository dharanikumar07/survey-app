<?php

namespace App\Http\Helper;

use Illuminate\Support\Facades\Log;

class Helper
{
    public static function logError($message, $location, $errorObject = null, $reference = [])
    {
        $data = [
            'location' => is_array($location) ? implode('@', $location) : $location,
        ];

        if ($errorObject) {
            $data['message'] = $errorObject->getMessage();
            $data['trace'] = $errorObject->getTraceAsString();
        }

        if ($reference) {
            $data['reference'] = $reference;
        }

        Log::error([$message => $data]);
    }
}
