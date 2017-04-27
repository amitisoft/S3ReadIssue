"use strict";
var GetCandidateHandler = (function () {
    function GetCandidateHandler(facade) {
        var _this = this;
        this.facade = facade;
        this.handler = function (event, context, callback) {
            _this.facade.getAll().subscribe(function (result) {
                var response = {
                    statusCode: 200,
                    body: result
                };
                callback(null, response);
            }, function (error) {
                callback(error);
            }, function () {
                console.log("completed");
            });
        };
    }
    return GetCandidateHandler;
}());
exports.GetCandidateHandler = GetCandidateHandler;
