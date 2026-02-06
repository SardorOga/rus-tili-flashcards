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
        Schema::create('verb_sentences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('verb_id')->constrained('verbs')->onDelete('cascade');
            $table->string('aspect');
            $table->string('tense');
            $table->tinyInteger('person_index');
            $table->text('sentence_template');
            $table->string('correct_answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verb_sentences');
    }
};
