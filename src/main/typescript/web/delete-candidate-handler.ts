import { Context, Callback } from 'aws-lambda';
import { CandidateFacade } from '../facade/candidate-facade';

export class DeleteCandidateHandler {

    constructor(private facade: CandidateFacade) {
        console.log("in DeleteCandidateHandler constructor");
    }

    handler = (event: any, context: Context, callback: Callback) => {
        console.log("calling facade get all candidates");
        this.facade.getAll().subscribe(
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
                console.log("completed delete candidate");
            }
        );

    }
}