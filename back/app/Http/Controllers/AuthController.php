<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(AuthLoginRequest $request): JsonResponse
    {
        if (! $token = auth('api')->attempt($request->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }
    public function refresh(): JsonResponse
    {
        $refreshedToken = Auth::guard('api')->refresh(true);

        return $this->respondWithToken($refreshedToken);
    }

    public function logout(): int
    {
        auth()->logout();

        return 200;
    }

    public function me(): JsonResponse
    {
        auth()->user()->getRoleNames();
        return response()->json(auth()->user());
    }
}
