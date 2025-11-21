<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use JeroenG\Explorer\Application\Explored;
use JeroenG\Explorer\Application\IndexSettings;
use Laravel\Scout\Searchable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject, Explored, IndexSettings
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $guard_name = ['api'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function reports (): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function comments (): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function notifications (): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    public function userSharedReports (): BelongsToMany
    {
        return $this->belongsToMany(Report::class, 'user_shared_reports')
            ->using(UserSharedReport::class)
            ->withTimestamps();
    }

    public function indexSettings(): array
    {
        return config('explorer.default_index_settings.index');
    }

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email
        ];

    }

    public function mappableAs(): array
    {
        return [
            'name' => [
                'type' => 'text',
                'analyzer' => 'index_analyzer',
                'search_analyzer' => 'search_analyzer',
            ],
            'email' => [
                'type' => 'text',
                'analyzer' => 'index_analyzer',
                'search_analyzer' => 'search_analyzer',
            ]
        ];
    }

}
