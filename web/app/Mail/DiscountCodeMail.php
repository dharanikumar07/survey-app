<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DiscountCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $customer_name;
    public $discount_code;

    public $customer_email;

    /**
     * @param string $subjectText Email subject
     * @param string $templateContent HTML content (shortcodes replaced)
     */
    public function __construct(string $discount_code, string $customer_name = null, string $email = null)
    {
        $this->customer_name = $customer_name;
        $this->discount_code = $discount_code;
        $this->customer_email = $email;
    }

    public function build()
    {
        return $this->subject('Claim Your Discount')
            ->view('emails.discount_code')
            ->with([
                'customerName' => $this->customer_name,
                'discountCode' => $this->discount_code,
                'customerEmail' => $this->customer_email,
            ]);
    }
}
