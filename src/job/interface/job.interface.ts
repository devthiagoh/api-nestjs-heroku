import { Document } from 'mongoose';
import { Company } from 'src/company/schema/company.schema';

export interface Job extends Document {

    readonly _id: String;
    readonly name: String;
    readonly description: String;
    readonly type: String;
    readonly status: Boolean;
    readonly companies: Company[];
}