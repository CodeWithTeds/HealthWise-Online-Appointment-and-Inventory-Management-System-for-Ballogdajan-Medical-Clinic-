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
            $table->string('phone', 20)->nullable()->after('role');
            $table->string('gender', 10)->nullable()->after('phone');
            $table->date('birthdate')->nullable()->after('gender');
            $table->string('address')->nullable()->after('birthdate');
            $table->string('status', 20)->default('active')->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['phone', 'gender', 'birthdate', 'address', 'status']);
        });
    }
};
