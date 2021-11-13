import { CompanyDTO } from "src/company/dto/company.dto";

export class JobDTO {

    readonly _id: string;
    readonly name: string;
    readonly description: string;
    readonly type: string;
    readonly status: boolean;
    readonly companies: CompanyDTO[];
} 