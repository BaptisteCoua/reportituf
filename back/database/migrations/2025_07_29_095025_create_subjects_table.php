<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Report;
use App\Models\Priority;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('stakeholder');
            $table->longText('description');
            $table->date('start_at')->nullable();
            $table->date('end_at')->nullable();
            $table->foreignIdFor(Report::class)->constrained();
            $table->foreignIdFor(Priority::class)->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
