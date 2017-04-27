import { GetCandidateHandler } from '../../typescript/web/get-candidate-handler';
import { CreateCandidateHandler } from '../../typescript/web/create-candidate-handler';
import { FindCandidateHandler } from '../../typescript/web/find-candidate-handler';
import { UpdateCandidateHandler } from '../../typescript/web/update-candidate-handler';
import { DeleteCandidateHandler } from '../../typescript/web/delete-candidate-handler';
import { CandidateFacade } from '../../typescript/facade/candidate-facade';
import { CandidateService, CandidateServiceImpl } from '../../typescript/service/candidate-service';

class AppContext {

    endPoint: string = process.env.CANDIDATE_ALL_END_POINT;

    candidateService() : CandidateService {
        return new CandidateServiceImpl();
    }

    candidateFacade(): CandidateFacade {
        return new CandidateFacade(this.candidateService());
    }
}

let appContext: AppContext = new AppContext();
// exports.getAllCandidatesHandler = new GetCandidateHandler(appContext.candidateFacade()).handler;
//exports.createCandiateHandler = new CreateCandidateHandler(appContext.candidateFacade()).handler;
// exports.getCandiateHandler = new FindCandidateHandler(appContext.candidateFacade()).handler;
exports.updateCandidateHandler = new UpdateCandidateHandler(appContext.candidateFacade()).handler;
//exports.updateCandidateHandler = new UpdateCandidateHandler(appContext.candidateFacade()).handler;
