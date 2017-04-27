import { Context, Callback } from 'aws-lambda';
import { CandidateFacade } from '../facade/candidate-facade';

export class CreateCandidateHandler {

    constructor(private facade: CandidateFacade) {
        console.log("in CreateCandidateHandler constructor");
    }

    handler = (event: any, context: Context, callback: Callback) => {
        console.log("calling facade get create candidates");
        const data = JSON.parse(event.body);
        this.facade.createCandidate(data).subscribe(
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
                console.log("completed creating candidate");
            }
        );

    }
}