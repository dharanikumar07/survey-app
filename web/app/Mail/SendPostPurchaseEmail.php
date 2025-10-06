<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendPostPurchaseEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $emailData;
    public $store;
    public $survey;
    public $order;
    public $customer;

    public function __construct($emailData, $survey, $order, $customer, $store = null)
    {
        $this->emailData = $emailData;
        $this->survey = $survey;
        $this->store = $store;
        $this->order = $order;
        $this->customer = $customer;
    }

    public function build()
    {
        $emailSubject = strip_tags($this->replaceShortcodes($this->emailData['subject'] ?? ''));
        $emailBody    = $this->replaceShortcodes($this->emailData['message'] ?? '');
        $emailFooter  = $this->replaceShortcodes($this->emailData['footer'] ?? '');
        $surveyLink   = $this->survey?->getSurveyLink() ?? '#';

        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->subject($emailSubject)
            ->view('emails.post-purchase-template', [
                'emailSubject' => $emailSubject,
                'emailBody' => $emailBody,
                'emailFooter' => $emailFooter,
                'survey_link' => $surveyLink,
                'store' => $this->store,
                'survey' => $this->survey,
                'order' => $this->order,
                'customer' => $this->customer,
            ]);
    }

    private function replaceShortcodes($text)
    {
        if (!$text) return '';

        $buttonHtml = $this->survey
            ? '<div style="text-align:center; margin:32px 0;">
                <a href="' . $this->survey->getSurveyLink() . '" target="_blank"
                   style="display:inline-block; padding:14px 32px; background-color:#4f46e5; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:bold; font-size:16px;">
                   Take the Survey
                </a>
           </div>'
            : '';

        return strtr($text, [
            '{{customer_name}}'       => $this->customer?->getName() ?? 'John Doe',
            '{{customer_first_name}}' => $this->customer?->getFirstName() ?? 'John',
            '{{customer_last_name}}'  => $this->customer?->getLastName() ?? 'Doe',
            '{{order_id}}'            => $this->order?->getOrderId() ?? 'TEST123',
            '{{order_name}}'          => $this->order?->getOrderName() ?? 'Test Order',
            '{{survey_link}}'         => $buttonHtml,
            '{{store_name}}'          => $this->store?->name ?? config('app.name'),
            '{{store_url}}'           => $this->store?->store_url ?? '#',
        ]);
    }
}
