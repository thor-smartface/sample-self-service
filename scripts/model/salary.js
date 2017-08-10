const mcs = require("../lib/mcs");
const Http = require("sf-core/net/http");

exports.getSalaryList = getSalaryList;

function getSalaryList(request, callback) {
    if (!callback && request) {
        callback = request;
        request = null;
    }
    var requestOptions = Object.assign(mcs.createRequestOptions({
        apiName: "SelfService",
        endpointName: "salary"
    }), {
        method: "GET"
    });
    if (request)
        requestOptions.body = JSON.stringify(request);


    Http.request(requestOptions,
        function(response) {
            var responseBody = response.body.toString();
            try {
                responseBody = JSON.parse(responseBody);
            }
            finally {}
            callback && callback(null, responseBody);
        },
        function(e) {
            var responseBody = e.body.toString();
            try {
                responseBody = JSON.parse(responseBody);
            }
            finally {}
            callback && callback(responseBody);
        }
    );
}