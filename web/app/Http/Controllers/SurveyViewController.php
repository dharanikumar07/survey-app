<?php

namespace App\Http\Controllers;

class SurveyViewController
{
    public function getSurveyWidget()
    {
        return view('survey.widget');
    }
}
