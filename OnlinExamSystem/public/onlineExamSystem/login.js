$(init);

function init() {

  $("body").on('click', '#loginBtn', doLogin);
}

function doLogin() {
  $.ajax({
    type: "POST",
    url: "/",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      'usr': $("#usr").val(),
      'pwd': $("#pwd").val()
    }),
    success: function(result) {
      if (result.code == 99) {
        $(".login-box-msg").text(result.msg);
      } else {
        $.cookie('username', result.data.userId, {expires:30});
        $.cookie('password', result.data.password, {expires:30});
        $.cookie('id', result.data._id, {expires:30});
        if(result.data.category === "TEACHER") {
          location.href = "/p/index";
        } else{
          location.href = "/p/indexStudent";
        }
      }
    }
  })
}