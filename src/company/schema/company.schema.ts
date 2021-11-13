import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Job } from 'src/job/schema/job.schema';
import * as mongoose from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company extends Document {

    @Prop()
    name: string;
    
    @Prop()
    zipCode: string;
    
    @Prop()
    state: string;

    @Prop()
    city: string;

    @Prop()
    neighborhood: string;

    @Prop()
    address: string;

    @Prop()
    number: string;
    
    @Prop()
    status: boolean;
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }] })
    jobs: Job[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);