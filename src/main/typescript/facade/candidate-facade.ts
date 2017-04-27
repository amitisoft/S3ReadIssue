import { Observable, Observer } from 'rxjs';
import { CandidateService } from '../service/candidate-service';
import { CandidateDto } from '../dto/candidate-dto';
import { CandidatesDto } from '../dto/candidates-dto';
import { Candidate } from '../domain/candidate';


export class CandidateFacade {

    constructor(private candidateService: CandidateService) {
    }

    getAll(): Observable<CandidatesDto> {
        console.log("in CandidateFacade getAll()");

        return this.candidateService.getAll()
            .map((candidates) => {
                return {
                    candidates: candidates.map(this.mapCandidateToDto)
                }
            });
    }

    private mapCandidateToDto(candidate: Candidate): CandidateDto {
        console.log("in mapCandidateToDto");
        return {
            candidateId: candidate.candiateId,
            fullName: `${candidate.firstName} ${candidate.lastName}`,
            email: candidate.email
        }
    }


    createCandidate(data: any) : Observable<Candidate> {
        //validate data as per business logic
        return this.candidateService.create(data);
    }


    updateCandidate(data: any) :Observable<Candidate> {
        return this.candidateService.update(data);
    }

    findCandidate(candidateId: string) : Observable<Candidate> {
        return this.candidateService.find(candidateId);
    }

}