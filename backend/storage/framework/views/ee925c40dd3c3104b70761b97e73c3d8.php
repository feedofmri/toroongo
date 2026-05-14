<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify Your Email - Toroongo</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: #f8fafc; 
            margin: 0; 
            padding: 0; 
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 60px;
            padding-top: 60px;
        }
        .container { 
            max-width: 500px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 20px; 
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .header { 
            background-color: #008080; /* Toroongo Teal */
            padding: 40px 20px;
            text-align: center; 
        }
        .logo { 
            font-size: 32px; 
            font-weight: 800; 
            color: #ffffff; 
            text-decoration: none;
            letter-spacing: -1px;
        }
        .content { 
            padding: 40px 30px;
            text-align: center; 
            color: #0f172a; 
        }
        h1 {
            font-size: 24px;
            font-weight: 700;
            margin-top: 0;
            color: #0f172a;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #64748b;
            margin-bottom: 30px;
        }
        .otp-box { 
            font-size: 42px; 
            font-weight: 800; 
            color: #008080; 
            letter-spacing: 8px; 
            margin: 20px 0; 
            padding: 25px; 
            background: #f0fdfa; 
            border-radius: 16px; 
            display: inline-block;
            border: 2px dashed #48C9B0;
        }
        .footer { 
            text-align: center; 
            padding: 20px;
            color: #94A3B8; 
            font-size: 12px; 
        }
        .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 0 30px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">Toroongo</div>
            </div>
            <div class="content">
                <h1>Email Verification</h1>
                <p>Hello! Use the verification code below to confirm your email address and finish setting up your account.</p>
                <div class="otp-box"><?php echo e($otp); ?></div>
                <p style="margin-top: 30px; font-size: 14px;">This code will expire in 10 minutes. <br>If you didn't request this, you can safely ignore this message.</p>
            </div>
            <div class="divider"></div>
            <div class="footer">
                &copy; <?php echo e(date('Y')); ?> Toroongo. All rights reserved.<br>
                Empowering your commerce journey.
            </div>
        </div>
    </div>
</body>
</html>
<?php /**PATH F:\Areas\Development\Projects\React\toroongo\backend\resources\views\emails\otp.blade.php ENDPATH**/ ?>