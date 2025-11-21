<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class CommentAddedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Comment $comment)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'model_type' => Comment::class,
            'report_id' => $this->comment->subject->report->getKey(),
            'comment_id' => $this->comment->getKey(),
            'text' => $this->comment->user->name . ' à ajouter un commentaire au raport ' . $this->comment->subject->report->title . '.',
            'user_id' => $this->comment->user->getKey(),
            'user_name' => $this->comment->user->name,
        ];
    }
}
