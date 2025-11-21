<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserSharedReport extends Pivot
{
    /** @use HasFactory<\Database\Factories\UserSharedReportFactory> */
    use HasFactory;

    protected $table = 'user_shared_reports';
    protected $fillable = [
        'is_opened',
    ];
    public function report(): belongsTo
    {
        return $this->belongsTo(Report::class);
    }

    public function user(): belongsTo
    {
        return $this->belongsTo(User::class);
    }
}
