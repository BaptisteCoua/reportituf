<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;

class AzureAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('azure')->with(['prompt' => 'select_account'])->stateless(true)->redirect();
    }
    public function login(): \Illuminate\Http\JsonResponse
    {
        $azureUser = Socialite::driver('azure')->stateless(true)->user();

        $user = User::where('email', $azureUser->email)->firstOrFail();

        $token = JWTAuth::fromUser($user);
        JWTAuth::setToken($token);

        return $this->respondWithToken($token);
    }
}
