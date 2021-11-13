import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JobDTO } from '../dto/job.dto';
import { Job, JobDocument } from '../schema/job.schema';
    
@Injectable()
export class JobService {

  constructor(@InjectModel(Job.name) private readonly model: Model<JobDocument>) { }
    
  async create(dto: JobDTO): Promise<Job> {
    const job = await this.model.create(dto);
    return job.save();
  }

  async createMany(dtos: JobDTO[]): Promise<Job[]> {
    const jobs = await this.model.insertMany(dtos);
    return jobs;
  }  
    
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

  async edit(dto: JobDTO): Promise<Job> {
    const companies = dto.companies;
    const job = await this.model.findByIdAndUpdate(dto._id, dto, { $push: { companies }, new: true });
    return job;
  }

  async editMany(dtos: JobDTO[]): Promise<Job[]> {

    let jobs: Job[] = [];

    for await (const job of dtos) {
      const companies = job.companies;
      const updated = await this.model.findByIdAndUpdate(job._id, job, { $push: { companies }, new: true });
      jobs.push(updated);
    }

    return jobs;
  }

  async delete(id): Promise<void> {

    const job = await this.model.findById(id).populate("companies");

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

      await this.model.findByIdAndRemove(id);
    });

    await Promise.all(promises);

    return jobs;
  }
}