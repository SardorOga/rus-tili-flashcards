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
        Schema::create('grammar_sentence_examples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grammar_case_id')->constrained('grammar_cases')->onDelete('cascade');
            $table->text('sentence_ru');
            $table->text('sentence_uz');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grammar_sentence_examples');
    }
};
