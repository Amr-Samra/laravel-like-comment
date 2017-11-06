<?php

namespace risul\LaravelLikeComment\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\NewComment;
use App\User;

class Comment extends Model
{
	/**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'laravellikecomment_comments';

    /**
	 * Fillable array
     */
    protected $fillable = ['user_id', 'parent_id', 'item_id', 'comment','attachment'];

    Protected $events = [
        'created' => NewComment::class
    ];

    public static function getUploadPath()
    {
        return 'comments/'.date('Y/m');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function file()
    {
        return $this->belongsTo(\App\File::class,'attachment');
    }
}