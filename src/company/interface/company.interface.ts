import { Document } from 'mongoose';
import { Job } from 'src/job/schema/job.schema';

export interface Company extends Document {

    readonly _id: string;
    readonly name: string;
    readonly zipCode: string;
    readonly state: string;
    readonly city: string;
    readonly neighborhood: string;
    readonly address: string;
    readonly number: string;
    readonly jobs: Job[];
    readonly status: boolean;
}