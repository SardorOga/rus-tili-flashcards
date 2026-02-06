<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grammar_rows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grammar_case_id')->constrained('grammar_cases')->onDelete('cascade');
            $table->string('type');
            $table->boolean('is_animate')->nullable();
            $table->string('sg_ending');
            $table->json('sg_examples');
            $table->string('pl_ending');
            $table->json('pl_examples');
            $table->tinyInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grammar_rows');
    }
};
