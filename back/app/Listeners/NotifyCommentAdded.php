<?php

namespace App\Listeners;

use App\Models\Comment;
use App\Notifications\CommentAddedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyCommentAdded
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Comment $comment): void
    {
        $comment->subject->report->users
            ->filter(fn($user) => $user->getKey() !== $comment->user->getKey())
            ->each(fn($user) => $user->notify(new CommentAddedNotification($comment)));

        if ($comment->user->isNot($comment->subject->report->creator))
            $comment->subject->report->creator->notify(new CommentAddedNotification($comment));
    }
}
