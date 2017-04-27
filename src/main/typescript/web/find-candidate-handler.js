"use strict";
var FindCandidateHandler = (function () {
    function FindCandidateHandler(facade) {
        var _this = this;
        this.facade = facade;
        this.handler = function (event, context, callback) {
            console.log("calling facade get all candidates");
            _this.facade.getAll().subscribe(function (result) {
                console.log("coming hererererer");
                var response = {
                    statusCode: 200,
                    body: result
                };
                console.log("responses:" + response);
                callback(null, response);
            }, function (error) {
                console.log("coming hererererer error");
                callback(error);
            }, function () {
                console.log("completed");
            });
        };
        console.log("in GetCandidateHandler constructor");
    }
    return FindCandidateHandler;
}());
exports.FindCandidateHandler = FindCandidateHandler;
