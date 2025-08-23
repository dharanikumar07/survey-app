<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey #1</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.5;
            color: #202223;
            background: #f6f6f7;
        }
        button:focus,
        input:focus,
        textarea:focus {
            outline: 2px solid #2c6ecb;
            outline-offset: 2px;
        }
        @media (max-width: 768px) {
            .th-sf-survey-container {
                padding: 16px;
            }
            .th-sf-survey-card {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
<div class="th-sf-survey-container" style="padding: 32px; background: #f6f6f7; min-height: 100vh;">
    {!! $survey->getSurveyHtmlContent() !!}
</div>
<script src="{{ asset('assets/js/survey-widget.js') }}"></script>
</body>
</html>
