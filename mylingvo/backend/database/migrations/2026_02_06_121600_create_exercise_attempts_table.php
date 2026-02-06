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
        Schema::create('exercise_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('exercise_type');
            $table->unsignedBigInteger('content_id');
            $table->string('content_type');
            $table->boolean('is_correct');
            $table->string('answer_given');
            $table->string('correct_answer');
            $table->integer('time_spent_ms')->nullable();
            $table->timestamp('created_at');

            $table->index(['user_id', 'exercise_type']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_attempts');
    }
};
