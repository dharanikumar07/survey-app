<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ strip_tags($emailSubject) ?? 'Feedback Request' }}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif; color:#333;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f4f7; padding: 20px 0;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="padding: 20px; text-align: center; background-color:#4f46e5; color:#ffffff; font-size:22px; font-weight:bold;">
                        {{ $store->name ?? "Store" }}
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding: 32px;">
                        <!-- Subject -->
                        <h1 style="font-size:22px; margin:0 0 20px 0; color:#111; text-align:center;">
                            {!! $emailSubject !!}
                        </h1>

                        <!-- Message -->
                        <div style="font-size:15px; line-height:1.6; color:#333;">
                            {!! $emailBody !!}
                        </div>

                        <!-- Footer message -->
                        <div style="font-size:14px; line-height:1.6; margin-top:24px; color:#555;">
                            {!! $emailFooter !!}
                        </div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding: 20px; text-align: center; font-size:12px; color:#999; background-color:#f9fafb;">
                        &copy; {{ date('Y') }} {{ $store->name ?? config('app.name') }}<br>
                        <a href="{{ $store->url ?? '#' }}" target="_blank" style="color:#4f46e5; text-decoration:none;">
                            {{ $store->url ?? '' }}
                        </a>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>
</body>
</html>
