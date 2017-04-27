"use strict";
var rxjs_1 = require("rxjs");
var aws_sdk_1 = require("aws-sdk");
var DocumentClient = aws_sdk_1.DynamoDB.DocumentClient;
var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1"
});
var CandidateServiceImpl = (function () {
    function CandidateServiceImpl() {
    }
    CandidateServiceImpl.prototype.getAll = function () {
        console.log("in CandidateServiceImpl getAll()");
        var queryParams = {
            TableName: "candidates",
            ProjectionExpression: "candidateId, firstName, lastName, email, phoneNumber",
            KeyConditionExpression: "#candidateId = :candidateIdFilter",
            ExpressionAttributeNames: {
                "#candidateId": "candidateId"
            },
            ExpressionAttributeValues: {
                ":candidateIdFilter": "1"
            }
        };
        var documentClient = new DocumentClient();
        return rxjs_1.Observable.create(function (observer) {
            console.log("Executing query with parameters " + queryParams);
            documentClient.query(queryParams, function (err, data) {
                console.log("did we get error " + err);
                if (err) {
                    observer.error(err);
                    throw err;
                }
                console.log("data items receieved " + data.Items.length);
                if (data.Items.length === 0) {
                    console.log("no data received for getAll candidates");
                    observer.complete();
                    return;
                }
                data.Items.forEach(function (item) {
                    console.log("candidate Id " + item.candidateId);
                    console.log("candidate firstName " + item.firstName);
                    console.log("candidate lastName " + item.lastName);
                    console.log("candidate email " + item.email);
                });
                observer.next(data.Items);
                observer.complete();
            });
        });
    };
    return CandidateServiceImpl;
}());
exports.CandidateServiceImpl = CandidateServiceImpl;
