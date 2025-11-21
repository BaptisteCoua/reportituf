<?php

use App\Models\Status;
use App\Models\User;
use App\Models\Team;
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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->boolean('is_opened');
            $table->foreignIdFor(Status::class)->constrained();
            $table->foreignIdFor(User::class, 'creator_id')->constrained();
            $table->foreignIdFor(Team::class)->constrained();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
