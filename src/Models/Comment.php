<?php

namespace risul\LaravelLikeComment\Models;

use Illuminate\Database\Eloquent\Model;
use App\Events\NewComment;
use App\User;
use App\File;
use risul\LaravelLikeComment\Models\Comment;

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
    protected $fillable = ['user_id', 'parent_id', 'item_id', 'comment', 'attachment'];

    Protected $events = [
        'created' => NewComment::class
    ];

    public static $rules = [
        'user_id'    => 'required',
        'parent_id'  => 'nullable',
        'item_id'    => 'required',
        'comment'    => 'required',
        'attachment' => 'file|mimes:jpeg,bmp,png,ico,psd,doc,docx,txt,pdf,rtf,zip,rar'
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
        return $this->belongsTo(File::class,'attachment');
    }

    public function children()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function relatedModel()
    {
        $contain = explode("_", $this->item_id);
        $model = $contain[0];
        $id = $contain[1];
        $model_class = 'App\\'.$model;
        $item = $model_class::find($id);
        $related = ['name' => $model, 'item' => $item];
        return $related;
    }
}
