<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Discount Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background: #f9f9f9;
            padding: 20px;
        }
        .container {
            background: #fff;
            padding: 30px;
            max-width: 600px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0px 0px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2d3748;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .discount-code {
            display: inline-block;
            background: #f4f4f4;
            padding: 10px 15px;
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            border-radius: 6px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
<div class="container">
    @if(!empty($customerName))
        <h1>Hi {{ $customerName }},</h1>
        <p>We’re excited to give you a special discount just for you!</p>
    @else
        <h1>Hello!</h1>
        <p>We have a special discount for you!</p>
    @endif

    {{-- Static context message --}}
    <p>Thank you for submitting the survey for our store! We appreciate your feedback and want to reward you with this discount.</p>

    <p>Your discount code is:</p>
    <div class="discount-code">{{ $discountCode }}</div>

    @if(!empty($customerEmail))
        <p><strong>Note:</strong> This discount is valid only for this email ID: {{ $customerEmail }}</p>
    @endif

    <div class="footer">
        &copy; {{ date('Y') }} Your Company. All rights reserved.
    </div>
</div>
</body>
</html>
