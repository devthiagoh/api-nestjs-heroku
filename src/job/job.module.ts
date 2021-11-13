import { Module } from '@nestjs/common';
import { JobService } from './service/job.service';
import { JobController } from './controller/job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schema/job.schema';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]) ],  
  providers: [JobService],
  controllers: [JobController]
})
export class JobModule {}
