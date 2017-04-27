import { Context, Callback } from 'aws-lambda';
import { CandidateFacade } from '../facade/candidate-facade';

export class FindCandidateHandler {

    constructor(private facade: CandidateFacade) {
        console.log("in GetCandidateHandler constructor");
    }

    handler = (event: any, context: Context, callback: Callback) => {
        console.log("calling facade find candidates");
        console.log("got event data" + JSON.stringify(event));
        let candidateId = event.pathParameters.id || -1;

        this.facade.findCandidate(candidateId).subscribe(
            result => {
                const response = {
                    statusCode: 200,
                    body: result
                }
                console.log("responses:" + response);
                callback(null, response);
            },
            error => {
                callback(error);
            },
            () => {
                console.log("completed find single candidate");
            }
        );

    }
}