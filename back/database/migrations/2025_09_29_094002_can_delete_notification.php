<?php

use App\Utils\Traits\HandlesPermissionsCreation;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    Use HandlesPermissionsCreation;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles_structure = [
            'admin' => [
                'notifications' => 'do',
            ],
            'user' => [
                'notifications' => 'do',
            ],
        ];

        $except = [];

        $this->createPermissions($roles_structure, $except);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
