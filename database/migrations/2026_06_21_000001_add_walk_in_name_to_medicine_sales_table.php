<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicine_sales', function (Blueprint $table): void {
            $table->string('walk_in_name', 255)->nullable()->after('patient_id');
        });

        // Make patient_id nullable to allow walk-in without registered account
        // Use raw statement to avoid requiring doctrine/dbal
        try {
            DB::statement('ALTER TABLE medicine_sales MODIFY patient_id BIGINT UNSIGNED NULL');
        } catch (\Throwable $e) {
            // Fallback for sqlite/testing
            try {
                Schema::table('medicine_sales', function (Blueprint $table): void {
                    $table->unsignedBigInteger('patient_id')->nullable()->change();
                });
            } catch (\Throwable $e2) {}
        }
    }

    public function down(): void
    {
        Schema::table('medicine_sales', function (Blueprint $table): void {
            $table->dropColumn('walk_in_name');
        });
        try {
            DB::statement('ALTER TABLE medicine_sales MODIFY patient_id BIGINT UNSIGNED NOT NULL');
        } catch (\Throwable $e) {}
    }
};
