<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Shopify\Context;
use Shopify\Utils;

class SpaController extends Controller
{
    public function fallback(Request $request)
    {
        if (Context::$IS_EMBEDDED_APP && $request->query('embedded', false) === '1') {
            $path = app()->environment('production')
                ? public_path('index.html')
                : base_path('frontend/index.html');

            return file_get_contents($path);
        }

        return redirect(Utils::getEmbeddedAppUrl($request->query('host', null)) . '/' . $request->path());
    }
}


