<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    use \App\Utils\Traits\HandlesPermissionsCreation;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles_structure = [
            'admin' => [
                'users' => 'c,v,u,d',
                'teams' => 'c,v,u,d',
                'priorities' => 'c,v,u,d',
                'statuses' => 'c,v,u,d',
                'reports' => 'c,v,u,d',
                'subjects' => 'c,v,u,d',
                'user_shared_reports' => 'c,v,u,d',
                'comments' => 'c,v,u,d',
                'notifications' => 'vo',
            ],
            'user' => [
                'users' => 'v',
                'teams' => 'c,v',
                'priorities' => 'v',
                'statuses' => 'v',
                'reports' => 'c,vo,uo',
                'subjects' => 'c,vo,uo,do',
                'user_shared_reports' => 'c,vo,uo',
                'comments' => 'c,vo,uo',
                'notifications' => 'vo',
            ],
        ];

        $except = [];

        $this->createRoles($roles_structure);

        $this->createPermissions($roles_structure, $except);

        $this->createUsersWithRoles();
    }

    protected function createUsersWithRoles(): void
    {
        $admin = \App\Models\User::factory()->create([
            'name' => 'VACHER Lorick',
            'email' => 'l.vacher-allouche@xefi.fr',
            'password' => 'password'
        ]);
        $admin->assignRole('admin');

        $admin = \App\Models\User::factory()->create([
            'name' => 'DEPAUW Eliott',
            'email' => 'e.depauw@xefi.fr',
            'password' => 'password'
        ]);
        $admin->assignRole('user');
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
