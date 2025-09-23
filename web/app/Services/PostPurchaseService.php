<?php

namespace App\Services;

use App\Models\Survey;

class PostPurchaseService
{
    public function getPostPurchaseEmailData($storeUuid = null)
    {
        $surveys = Survey::where('store_uuid', $storeUuid)
            ->get();

        $surveyData = [];
        foreach ($surveys as $survey) {
            $isEmailDataPresent = $survey->isEmailDataPresent();
            $surveyData[] = [
                'survey_uuid' => $survey->uuid,
                'survey_name' => $survey->name,
                'is_active'   => $survey->status,
                'email_data'  => $isEmailDataPresent
                    ? $survey->getEmailData()
                    : $this->getDefaultEmailData(),
            ];
        }

        return $surveyData;
    }

    public function getDefaultEmailData()
    {
        return [
            'subject' =>"<p>We’d love your feedback on your recent order</p>",
            'message' =>"<p>Hi {{customer_name}}, </p><p>Thank you for your recent purchase! 🎉 Your opinion means a lot to us, and we’d love to hear about your experience.</p><p> It only takes a minute to complete our short survey, and your feedback helps us improve and serve you better. {{survey_link}}</p>",
            'footer'  =>"<p>Thanks again for choosing us,</p><p> The store Team</p>"
        ];
    }
}
