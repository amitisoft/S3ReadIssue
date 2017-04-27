import { Context, Callback } from 'aws-lambda';
import { CandidateFacade } from '../facade/candidate-facade';

export class UpdateCandidateHandler {

    constructor(private facade: CandidateFacade) {
        console.log("in UpdateCandidateHandler constructor");
    }

    handler = (event: any, context: Context, callback: Callback) => {
        console.log(`calling facade update candidate ${JSON.stringify(event)}`);
        const data = event.body;
        console.log(`updating candidate with data from request ${data}`);

        this.facade.updateCandidate(data).subscribe(
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
                console.log("completed updating candidate");
            }
        );

    }
}