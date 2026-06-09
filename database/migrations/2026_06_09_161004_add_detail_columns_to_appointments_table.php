<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->string('contact_number', 20)->nullable()->after('symptoms');
            $table->string('allergies')->nullable()->after('contact_number');
            $table->string('current_medication')->nullable()->after('allergies');
            $table->text('medical_history')->nullable()->after('current_medication');
            $table->string('temperature', 10)->nullable()->after('medical_history');
            $table->string('blood_pressure', 20)->nullable()->after('temperature');
            $table->string('weight', 10)->nullable()->after('blood_pressure');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->dropColumn(['contact_number', 'allergies', 'current_medication', 'medical_history', 'temperature', 'blood_pressure', 'weight']);
        });
    }
};
