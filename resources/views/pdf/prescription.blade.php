<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Prescription</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #333; margin: 0; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #0787f7; padding-bottom: 15px; margin-bottom: 25px; }
        .header h1 { color: #0787f7; font-size: 22px; margin: 0; }
        .header p { color: #666; font-size: 11px; margin: 4px 0 0; }
        .rx-symbol { font-size: 28px; font-weight: bold; color: #0787f7; margin: 15px 0 10px; }
        .patient-info { background: #f8f9fa; padding: 12px 15px; border-radius: 6px; margin-bottom: 20px; }
        .patient-info table { width: 100%; }
        .patient-info td { padding: 3px 10px 3px 0; font-size: 11px; }
        .patient-info .label { font-weight: bold; color: #555; width: 120px; }
        .section { margin-bottom: 18px; }
        .section-title { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #0787f7; letter-spacing: 0.5px; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .section-content { padding-left: 10px; line-height: 1.6; white-space: pre-line; }
        .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 9px; color: #888; text-align: center; }
        .footer .clinic-name { font-weight: bold; color: #555; font-size: 10px; }
        .footer .disclaimer { margin-top: 4px; font-style: italic; }
        .date-line { text-align: right; font-size: 11px; color: #666; margin-bottom: 15px; }
        .signature { margin-top: 50px; text-align: right; }
        .signature .line { border-top: 1px solid #333; width: 200px; display: inline-block; margin-bottom: 4px; }
        .signature p { font-size: 11px; color: #555; margin: 2px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $clinicName }}</h1>
        <p>{{ $clinicAddress }}</p>
        <p>Contact: (075) 123-4567</p>
    </div>

    <div class="date-line">
        Date: {{ $prescription->created_at->format('F d, Y') }}
    </div>

    <div class="patient-info">
        <table>
            <tr>
                <td class="label">Patient Name:</td>
                <td>{{ $prescription->patient->name }}</td>
                <td class="label">Gender:</td>
                <td>{{ ucfirst($prescription->patient->gender ?? '—') }}</td>
            </tr>
            <tr>
                <td class="label">Birthdate:</td>
                <td>{{ $prescription->patient->birthdate ?? '—' }}</td>
                <td class="label">Contact:</td>
                <td>{{ $prescription->patient->phone ?? '—' }}</td>
            </tr>
            <tr>
                <td class="label">Address:</td>
                <td colspan="3">{{ $prescription->patient->address ?? '—' }}</td>
            </tr>
        </table>
    </div>

    <div class="rx-symbol">℞</div>

    <div class="section">
        <div class="section-title">Diagnosis</div>
        <div class="section-content">{{ $prescription->diagnosis }}</div>
    </div>

    <div class="section">
        <div class="section-title">Medications</div>
        <div class="section-content">{{ $prescription->medications }}</div>
    </div>

    @if($prescription->instructions)
    <div class="section">
        <div class="section-title">Instructions</div>
        <div class="section-content">{{ $prescription->instructions }}</div>
    </div>
    @endif

    @if($prescription->follow_up)
    <div class="section">
        <div class="section-title">Follow-up</div>
        <div class="section-content">{{ $prescription->follow_up }}</div>
    </div>
    @endif

    @if($prescription->notes)
    <div class="section">
        <div class="section-title">Notes</div>
        <div class="section-content">{{ $prescription->notes }}</div>
    </div>
    @endif

    <div class="signature">
        <div class="line"></div>
        <p><strong>Attending Doctor</strong></p>
        <p>License No: _______________</p>
    </div>

    <div class="footer">
        <div class="clinic-name">{{ $clinicName }} — {{ $clinicAddress }}</div>
        <div class="disclaimer">This prescription is valid for dispensing within 7 days from the date of issue. This document is system-generated and is considered official when signed by the attending physician.</div>
    </div>
</body>
</html>
