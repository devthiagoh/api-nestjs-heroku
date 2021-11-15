import { Module } from '@nestjs/common';
import { JobService } from './service/job.service';
import { JobController } from './controller/job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schema/job.schema';
import { CompanyService } from 'src/company/service/company.service';
import { Company, CompanySchema } from 'src/company/schema/company.schema';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }, { name: Company.name, schema: CompanySchema }]) ],  
  providers: [JobService, CompanyService],
  controllers: [JobController]
})
export class JobModule {}
