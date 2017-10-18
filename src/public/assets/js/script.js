$(document).ready(function(){
    var itemId=$('#showComment').data('item-id');
    $('.show-'+itemId+'-0').fadeIn('normal');
    $('.show-'+itemId+'-1').fadeIn('normal');
    $($('#write-comment').data("form")).show();
});


$('.laravelLike-icon').on('click', function(){
    if($(this).hasClass('disabled'))
        return false;
    var item_id = $(this).data('item-id');
    var vote = $(this).data('vote');

    $.ajax({
        method: "get",
        url: "/laravellikecomment/like/vote",
        data: {item_id: item_id, vote: vote},
        dataType: "json"
    })
        .done(function(msg){
            if(msg.flag == 1){
                if(msg.vote == 1){
                    $('#'+item_id+'-like').removeClass('outline');
                    $('#'+item_id+'-dislike').addClass('outline');
                }
                else if(msg.vote == -1){
                    $('#'+item_id+'-dislike').removeClass('outline');
                    $('#'+item_id+'-like').addClass('outline');
                }
                else if(msg.vote == 0){
                    $('#'+item_id+'-like').addClass('outline');
                    $('#'+item_id+'-dislike').addClass('outline');
                }
                $('#'+item_id+'-total-like').text(msg.totalLike == null ? 0 : msg.totalLike);
                $('#'+item_id+'-total-dislike').text(msg.totalDislike == null ? 0 : msg.totalDislike);
            }
        })
        .fail(function(msg){
            alert(msg);
        });
});


$(document).on('click', '.reply-button', function(){
    if($(this).hasClass("disabled"))
        return false;
    var toggle = $(this).data('toggle');
    $("#"+toggle).fadeToggle('normal');
});

$(document).on('submit', '.laravelComment-form', function(e){
    e.preventDefault();
    var thisForm = $(this);
    var parent = $(this).data('parent');
    var item_id = $(this).data('item');
    var comment = $('textarea#'+parent+'-textarea').val();

    var formd=new FormData(thisForm[0]);
    formd.append('parent',parent);
    formd.append('item_id',item_id);
    formd.append('comment',comment);
    $.ajax({

        url: "/laravellikecomment/comment/add",
        type:'post',
        data: formd,
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false
    })
        .done(function(msg){
            $(thisForm).toggle('normal');
            var newComment = '<div class="comment" id="comment-'+msg.id+'" style="display: initial;"><a class="avatar"><img src="'+msg.userPic+'"></a><div class="content"><a class="author">'+msg.userName+'</a><div class="metadata"><span class="date">Today at 5:42PM</span></div><div class="text">'+msg.comment+'<br>'+((msg.filePath)? ('<a target="_blank" href="'+msg.filePath+'">'+msg.fileName+'</a>'): '')+'</div><div class="actions"><a class="reply reply-button" data-toggle="'+msg.id+'-reply-form">Reply</a></div><form class="ui laravelComment-form form" id="'+msg.id+'-reply-form" data-parent="'+msg.id+'" data-item="'+item_id+'" style="display: none;"><div class="field"><textarea id="'+msg.id+'-textarea" rows="2"></textarea></div><input type="submit" class="ui basic small submit button" value="Reply"></form></div><div class="ui threaded comments" id="'+item_id+'-comment-'+msg.id+'"></div></div>';
            $('#'+item_id+'-comment-'+parent).prepend(newComment);
            $('textarea#'+parent+'-textarea').val('');
        })
        .fail(function(msg){
            alert(msg);
        });

    return false;
});


$(document).on('click', '#showComment', function(){
    var show = $(this).data("show-comment");
    $('.show-'+$(this).data("item-id")+'-'+show).fadeIn('normal');
    $(this).data("show-comment", show+1);
    $(this).text("Show more");
});


$(document).on('click', '#write-comment', function(){
    $($(this).data("form")).show();
});

