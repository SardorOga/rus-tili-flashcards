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
        Schema::create('exercise_words', function (Blueprint $table) {
            $table->id();
            $table->string('word');
            $table->string('word_uz');
            $table->string('gender', 4);
            $table->tinyInteger('sklonenie');
            $table->json('sg_forms');
            $table->json('pl_forms');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_words');
    }
};
