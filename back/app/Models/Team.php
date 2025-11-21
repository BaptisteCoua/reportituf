<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use JeroenG\Explorer\Application\Explored;
use JeroenG\Explorer\Application\IndexSettings;
use Laravel\Scout\Searchable;

class Team extends Model implements Explored, IndexSettings
{
    /** @use HasFactory<\Database\Factories\TeamFactory> */
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
    ];

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function indexSettings(): array
    {
        return config('explorer.default_index_settings.index');
    }

    public function mappableAs(): array
    {
        return [
            'name' => [
                'type' => 'text',
                'analyzer' => 'index_analyzer',
                'search_analyzer' => 'search_analyzer',
            ]
        ];
    }

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
        ];

    }
}
