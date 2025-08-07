<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class Util
{

    public static function getIdFromGraphql($id)
    {
        return Str::afterLast($id, '/');
    }
}
