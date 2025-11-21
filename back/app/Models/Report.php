<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use JeroenG\Explorer\Application\Explored;
use JeroenG\Explorer\Application\IndexSettings;
use Laravel\Scout\Searchable;

class Report extends Model implements Explored, IndexSettings
{
    /** @use HasFactory<\Database\Factories\ReportFactory> */
    use HasFactory, Searchable;

    protected $fillable = [
        'title',
        'is_opened',
        'creator_id',
        'created_at',
    ];

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_shared_reports')->using(UserSharedReport::class)->withTimestamps()->withPivot('is_opened');
    }

    public function indexSettings(): array
    {
        return config('explorer.default_index_settings.index');
    }

    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'creator_id' => $this->creator_id,
            'created_at' => $this->created_at,
        ];
    }

    public function mappableAs(): array
    {
        return [
            'title' => [
                'type' => 'text',
                'analyzer' => 'index_analyzer',
                'search_analyzer' => 'search_analyzer',
            ],
            'creator_id' => [
                'type' => 'integer',
            ],
            'created_at' => [
                'type' => 'date',
            ],
        ];
    }
}
