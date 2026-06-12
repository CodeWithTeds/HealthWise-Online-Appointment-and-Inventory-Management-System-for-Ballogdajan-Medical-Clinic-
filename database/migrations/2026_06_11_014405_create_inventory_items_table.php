<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('category', 50); // medicine, supply, equipment
            $table->text('description')->nullable();
            $table->string('unit', 30); // pcs, bottles, boxes, tablets, etc.
            $table->unsignedInteger('quantity')->default(0);
            $table->unsignedInteger('minimum_stock')->default(10);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->date('expiration_date')->nullable();
            $table->string('supplier')->nullable();
            $table->string('batch_number')->nullable();
            $table->string('status', 20)->default('active'); // active, discontinued
            $table->timestamps();
        });

        Schema::create('inventory_transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 20); // stock_in, stock_out, adjustment
            $table->integer('quantity'); // positive for in, negative for out
            $table->string('reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
        Schema::dropIfExists('inventory_items');
    }
};
