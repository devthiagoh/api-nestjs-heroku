import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Company } from 'src/company/schema/company.schema';
import * as mongoose from 'mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job extends Document {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    type: string;

    @Prop()
    status: boolean;
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }] })
    companies: Company[];
}

export const JobSchema = SchemaFactory.createForClass(Job);