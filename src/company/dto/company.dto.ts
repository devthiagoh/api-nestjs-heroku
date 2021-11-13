import { JobDTO } from "src/job/dto/job.dto";

export class CompanyDTO {

    readonly _id: string;
    readonly name: string;
    readonly state: string;
    readonly zipCode: string;
    readonly city: string;
    readonly neighborhood: string;
    readonly address: string;
    readonly number: string;
    readonly status: boolean;
    readonly jobs: JobDTO[];
} 