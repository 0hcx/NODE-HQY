$(init);

function init() {
	
	$("#defaultForm").validate({
		wrapper:"span",
		onfocusout:false,
		submitHandler:function(form) {
			addCategory();  //验证成功则调用添加新闻函数
		}
	})
}

function addCategory() {

  $.ajax({
	  type: "POST",
	  url: "/admin/categoryCreate",
	  contentType: "application/json",
	  dataType: "json",
	  data: JSON.stringify({
      'name': $("#categoryName").val()
	  }),
	  success: function(result) {
		  if (result.code == 99) {
			  alert(result.msg);
		  } else {
			  alert("创建成功！");
			  location.href = '/admin/news';
		  }
	  }
  })
}