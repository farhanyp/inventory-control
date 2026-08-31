<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>@yield('title', 'Laporan')</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        .header p { margin: 5px 0 0 0; font-size: 13px; color: #444; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; font-size: 11px; }
        th { background-color: #f4f4f4; text-align: center; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-danger { color: #d9534f; }
        .text-warning { color: #f0ad4e; }
        .text-success { color: #5cb85c; }
        .footer { margin-top: 30px; font-size: 10px; color: #777; text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVENTORY CONTROL ALFIA</h1>
        <p>@yield('title')</p>
        <p>@yield('subtitle')</p>
    </div>

    @yield('content')

    <div class="footer">
        Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}
    </div>
</body>
</html>
