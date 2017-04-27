"use strict";
var CandidateFacade = (function () {
    function CandidateFacade(candidateService) {
        this.candidateService = candidateService;
    }
    CandidateFacade.prototype.getAll = function () {
        var _this = this;
        console.log("in CandidateFacade getAll()");
        return this.candidateService.getAll()
            .map(function (candidates) {
            return {
                candidates: candidates.map(_this.mapCandidateToDto)
            };
        });
    };
    CandidateFacade.prototype.mapCandidateToDto = function (candidate) {
        console.log("in mapCandidateToDto");
        return {
            candidateId: candidate.candiateId,
            fullName: candidate.firstName + " " + candidate.lastName,
            email: candidate.email
        };
    };
    return CandidateFacade;
}());
exports.CandidateFacade = CandidateFacade;
