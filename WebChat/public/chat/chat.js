$(init);

function init() {
    $('[data-toggle="select"]').on('mouseover', function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.find('.users-list-r').show();
    });

    $('[data-toggle="select"]').on('mouseout', function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.find('.users-list-r').hide();
    });
    $('[data-toggle="select"]').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var friendId = $this.data('id');
        doAddFriend(friendId);
    });
}

function doAddFriend(friendId) {
    $.ajax({
        type: "POST",
        url: "/p/addFriend",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'user': $.cookie('id'),
            'friend': friendId
        }),
        success: function(result) {
            if (result.code == 99) {
                alert("添加出错");
            } else if(result.code == 98) {
                alert("该好友已添加！");
            } else{
                alert("添加成功！");
                location.href = '/p/index';
            }
        }
    })
}
