<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table): void {
            $table->id();
            $table->date('date')->unique()->index();
            $table->time('am_start')->default('08:00');
            $table->time('am_end')->default('12:00');
            $table->unsignedInteger('am_slots')->default(20);
            $table->unsignedInteger('am_booked')->default(0);
            $table->time('pm_start')->default('13:00');
            $table->time('pm_end')->default('17:00');
            $table->unsignedInteger('pm_slots')->default(20);
            $table->unsignedInteger('pm_booked')->default(0);
            $table->string('status', 20)->default('available');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
