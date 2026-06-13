<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_stats', function (Blueprint $table): void {
            $table->id();
            $table->date('date')->unique();
            $table->unsignedInteger('appointments_total')->default(0);
            $table->unsignedInteger('appointments_completed')->default(0);
            $table->unsignedInteger('appointments_cancelled')->default(0);
            $table->unsignedInteger('appointments_pending')->default(0);
            $table->unsignedInteger('patients_new')->default(0);
            $table->unsignedInteger('patients_total')->default(0);
            $table->unsignedInteger('inventory_low_stock')->default(0);
            $table->unsignedInteger('inventory_expired')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_stats');
    }
};
