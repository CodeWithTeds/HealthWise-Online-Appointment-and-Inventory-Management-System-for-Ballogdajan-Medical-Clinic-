<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->date('date')->index();
            $table->string('session', 5); // AM or PM
            $table->string('reason');
            $table->string('symptoms')->nullable();
            $table->string('priority_type', 30)->default('regular'); // regular, senior, pwd, pregnant
            $table->string('status', 20)->default('pending'); // pending, confirmed, completed, cancelled, not_arrived
            $table->unsignedInteger('queue_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
