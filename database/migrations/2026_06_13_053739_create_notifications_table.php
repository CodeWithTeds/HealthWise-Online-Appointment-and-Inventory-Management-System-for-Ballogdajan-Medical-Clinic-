<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinic_notifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 50); // appointment_created, appointment_cancelled, inventory_low, inventory_expired, queue_update
            $table->string('title');
            $table->text('message');
            $table->string('icon', 30)->default('bell');
            $table->string('link')->nullable();
            $table->boolean('read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinic_notifications');
    }
};
