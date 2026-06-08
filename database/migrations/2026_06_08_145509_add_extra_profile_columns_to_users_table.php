<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('contact_person')->nullable()->after('address');
            $table->string('contact_number', 20)->nullable()->after('contact_person');
            $table->string('blood_type', 5)->nullable()->after('contact_number');
            $table->string('civil_status', 20)->nullable()->after('blood_type');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['contact_person', 'contact_number', 'blood_type', 'civil_status']);
        });
    }
};
