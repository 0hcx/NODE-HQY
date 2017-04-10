var urlGetData = "/getData";

function postData(url, data, cb) {
    var promise = $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        contentType: "application/json",
        data: data
    });
    promise.done(cb);
}