import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDTO } from 'src/company/dto/company.dto';
import { Company, CompanyDocument } from '../../company/schema/company.schema';
import { JobDTO } from '../dto/job.dto';
import { Job, JobDocument } from '../schema/job.schema';

import { map, json } from '../../utils/utils';

@Injectable()
export class JobService {

  constructor(@InjectModel(Job.name) private readonly model: Model<JobDocument>,
              @InjectModel(Company.name) private readonly modelCompany: Model<CompanyDocument>) { }
  
  /*************************** finds ****************************/
  
  async findAll(params:Map<string, string>): Promise<Job[]> {
    
    let find = map(params);
    
    if(find?.has('active'))
      return this.getJobsActive();

    return this.getJobs();
  }
  
  async getJobs(): Promise<Job[]> {
    return (await this.model.find().populate("companies"));
  }
    
  async getJobsActive(): Promise<Job[]> {
    return (await this.model.find().populate("companies")).filter( job => job.status === true );
  }

  async get(id): Promise<Job> {
    const job = await this.model.findById(id).populate("companies").exec();
    return job;
  }

  /*************************** create ***************************/

  async create(dto: JobDTO): Promise<Job> {

    let promise = null;
    let company = '';      

    try {
      
      promise = dto.companies.forEach( async id => {
        const find = (await this.findCompanyById(id)).toObject();
        console.log(find.name);
        if(!find.status)
          company = find.name;
      });

      await Promise.all(promise);

      if(company)
        throw company;

    } catch (error) {
      throw new PreconditionFailedException(`Empresa ${company} está inativa! Por favor informe outra!`);
    }

    const job = await this.model.create(dto);
    const created = (await job.save()).populate("companies");
    const companies = (await created).companies;

    companies.forEach( async company => {
      const jobs = job;
      await this.modelCompany.findByIdAndUpdate(company._id, { $push: { jobs }, upsert: true });
    });

    return created;
  }

  async validateCompany(){
    
  }

  async createMany(dtos: JobDTO[]): Promise<Job[]> {
    const jobs = await this.model.insertMany(dtos);
    return jobs;
  }  
  
  /**************************** edit ****************************/

  async edit(dto: JobDTO): Promise<Job> {
    
    const jobUpdatedId = dto._id;
    const jobSaved = (await this.get(jobUpdatedId)).toObject();

    /************************* update job *************************/
    const updated = this.update(dto);
    const jobUpdated = (await updated).toObject();    
    
    /********************** update companies **********************/
    this.updateCompanies(jobUpdatedId, jobSaved, jobUpdated);

    return updated;
  }

  async update(dto: JobDTO) {
    const companies = dto.companies;
    return await (await this.model.findByIdAndUpdate(dto._id, dto, { $push: { companies }, new: true })).populate("companies");
  }

  async updateCompanies(jobUpdatedId, jobSaved, jobUpdated){

    /********************** update companies **********************/    
    jobUpdated.companies.forEach( async company => {
      const companyUpdated = (await this.findCompanyById(company._id)).toObject();
      const length = companyUpdated.jobs.length;
      if(length > 0){
        const found = companyUpdated.jobs.some(job => job._id.toString() === jobUpdatedId);
        if(!found) //prevent duplicate
          this.updateCompany(companyUpdated, jobUpdatedId);
      } else { 
        this.updateCompany(companyUpdated, jobUpdatedId);
      } 
    });

    /****************** unbind job of saved company *****************/
    jobSaved.companies.forEach( async companySaved => {
      const found = jobUpdated.companies.some(companyUpdated => companyUpdated._id.toString() === companySaved._id.toString());
      if(!found)
        this.unbindCompany(companySaved, jobUpdatedId);
    })
  }

  async unbindCompany(company, jobUpdatedId){
    const jobs = jobUpdatedId;
    await this.modelCompany.findByIdAndUpdate(company, { $pull: { jobs }, upsert: true });
  }

  async updateCompany(company, jobUpdatedId){
    const jobs = jobUpdatedId;
    return await this.modelCompany.findByIdAndUpdate(company, { $push: { jobs }, upsert: true });
  }
  
  async findCompanyById(_id){
    return (await this.modelCompany.findById(_id)).populate("jobs");
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
