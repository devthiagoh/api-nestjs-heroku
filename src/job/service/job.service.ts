import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../../company/schema/company.schema';
import { JobDTO } from '../dto/job.dto';
import { Job, JobDocument } from '../schema/job.schema';
    
@Injectable()
export class JobService {

  constructor(@InjectModel(Job.name) private readonly model: Model<JobDocument>,
              @InjectModel(Company.name) private readonly modelCompany: Model<CompanyDocument>) { }
  
  /*************************** finds ****************************/
              
  async get(id): Promise<Job> {
    const job = await this.model.findById(id).exec();
    return job;
  }
    
  async getJobs(): Promise<Job[]> {
    const jobs = (await this.model.find().populate("companies"));
    return jobs;
  }
    
  async getJobsActived(): Promise<Job[]> {
    const jobs = (await this.model.find().populate("companies")).filter( job => job.status === true );
    return jobs;
  }

  /*************************** create ***************************/

  async create(dto: JobDTO): Promise<Job> {
    
    const job = await this.model.create(dto);
    const created = (await job.save()).populate("companies");
    const companies = (await created).companies;

    companies.forEach( async company => {
      const jobs = job;
      await this.modelCompany.findByIdAndUpdate(company._id, { $push: { jobs }, upsert: true });
    });

    return created;
  }

  async createMany(dtos: JobDTO[]): Promise<Job[]> {
    const jobs = await this.model.insertMany(dtos);
    return jobs;
  }  
  
  /**************************** edit ****************************/

  async edit(dto: JobDTO): Promise<Job> {
    
    const companiesUpdate = dto.companies;
    // const companiesRemoveJob = [];
    // // console.log(companies);
    // const jobSaved = (await this.get(dto._id)).toObject();
    // jobSaved.companies.forEach( async companySaved => {
    //   console.log('companySaved: ' +companySaved._id.toString());
      
    //   const idsUpdate = companiesUpdate.map(companyUpdate => companyUpdate._id ? companyUpdate._id : companyUpdate);

    //   const found = idsUpdate.filter( companyUpdate => companyUpdate === companySaved.toString());
    //   console.log('found: ' +found.toString());  
    //   if(!found.values)
    //     console.log('not found');//await this.modelCompany.findByIdAndRemove(companySaved._id, { $push: { jobSaved }, upsert: true });  
    // });     

    const updated = await (await this.model.findByIdAndUpdate(dto._id, dto, { $push: { companiesUpdate }, new: true })).populate("companies");
    companiesUpdate?.forEach( async _id => {
      const jobs = dto;
      await this.modelCompany.findByIdAndUpdate(_id, { $push: { jobs }, upsert: true });
    }); 

    return updated;
  }

  async editMany(dtos: JobDTO[]): Promise<Job[]> {      

    let jobs: Job[] = [];

    for await (const job of dtos) {
      const companies = job.companies;
      const updated = await this.model.findByIdAndUpdate(job._id, job, { $push: { companies }, new: true }).populate("companies");
      jobs.push(updated);
    }

    return jobs;
  }

  /*************************** delete ***************************/

  async delete(id): Promise<void> {

    const job = await this.model.findById(id);

    if(!job)
      throw new NotFoundException("Job not found!");
      
    await this.model.findByIdAndRemove(id);
  }

  async deleteMany(ids: string[]): Promise<string[]> {

    let jobs = [];

    const promises = ids.map( async (id) =>  {
      
      const job = await this.model.findById(id);

      if(!job)
        jobs.push(id+": Job not found!");
      else
        await this.model.findByIdAndRemove(id);
    });

    await Promise.all(promises);

    return jobs;
  }
}