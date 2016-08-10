$(init);

function init() {
	$("body").on('click', '#respondBtn', doRespond);

}
$('[data-toggle="select"]').on('click', function (e) {
	e.preventDefault();
	var $this = $(this);
	var cid = $this.data('cid');
	var tid = $this.data('tid');

	if($('#tid').length > 0) {
		$('#tid').val(tid);
	}
	else {
		$('<input>').attr({
			id: 'tid',
			type: 'hidden',
			value: tid
		}).appendTo('#commentForm');
	}

	if($('#cid').length > 0) {
		$('#cid').val(cid);
	}
	else {
		$('<input>').attr({
			id: 'cid',
			type: 'hidden',
			value: cid
		}).appendTo('#commentForm');
	}

});
function doRespond() {
	// alert($("#news").val());
	// alert($('#tid').val());
	// alert($("#resContent").val());
	// alert($.cookie('id'));
	
  $.ajax({
	  type: "POST",
	  url: "/admin/addComment",
	  contentType: "application/json",
	  dataType: "json",
	  data: JSON.stringify({
		  'news': $("#news").val(),
		  'content': $("#resContent").val(),
		  'from': $.cookie('id'),
		  'to': $("#tid").val(),
		  'comment': $("#cid").val()
	  }),
	  success: function(result) {
		  if (result.code == 99) {
			  alert("出错");
		  } else {
			  alert("发布成功！");
			  location.href = '/p/'+ result.data._id;
		  }
	  }
  })
}