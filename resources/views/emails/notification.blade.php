<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 40px 20px; margin: 0; }
        .container { max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: #0787f7; padding: 24px 32px; text-align: center; }
        .header h1 { color: #fff; font-size: 20px; margin: 0; font-weight: 700; }
        .body { padding: 32px; }
        .title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 12px; }
        .message { font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px; }
        .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }
        .footer p { font-size: 11px; color: #94a3b8; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HealthWise Clinic</h1>
        </div>
        <div class="body">
            <p class="title">{{ $notifTitle }}</p>
            <p class="message">{{ $notifMessage }}</p>
        </div>
        <div class="footer">
            <p>Ballogdajan Medical Clinic &mdash; HealthWise System</p>
        </div>
    </div>
</body>
</html>
