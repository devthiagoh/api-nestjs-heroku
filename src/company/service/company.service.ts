import { ConsoleLogger, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyDTO } from '../dto/company.dto';
import { ObjectId } from 'mongodb';
import { Company, CompanyDocument } from '../schema/company.schema';

import { map, json } from '../../utils/utils';
    
@Injectable()
export class CompanyService {

  constructor(@InjectModel(Company.name) private readonly model: Model<CompanyDocument>) { }
  
  /*************************** finds ****************************/

  async findAll(params:Map<string, string>): Promise<Company[]> {
    
    let find = map(params);
    
    if(find?.has('active'))
      return this.getCompaniesActive();
      
    if(find?.has('job'))
      return this.getCompaniesByJob(find.get('job'));

    return this.getCompanies();
  }

  async getCompanies(): Promise<Company[]>{
    return (await this.model.find().populate("jobs"));
  }

  async getCompaniesActive(): Promise<Company[]> {
    return (await this.model.find({ status: true }).populate("jobs"));
  }

  async getCompaniesByJob(jobName): Promise<Company[]> {

    const companies = (await this.model.find().populate("jobs"));
    const companiesByJob = [];
    const promises = companies.map( async company => { 
      await company.jobs.map( async job => { 
        if(job.name === jobName)
          companiesByJob.push(company);
      });
    });

    await Promise.all(promises);

    return companiesByJob;
  }

  async get(id): Promise<Company> {
    const company = await this.model.findById(id).exec();
    return company;
  }

  /*************************** create ***************************/
  
  async create(dto: CompanyDTO[]): Promise<Company[]> {

    if(dto.length)
      return this.createMany(dto);

    return (await this.model.create(dto));
  }

  async createMany(dtos: CompanyDTO[]): Promise<Company[]> {
    return await this.model.insertMany(dtos);
  }

  /**************************** edit ****************************/

  async edit(dtos: CompanyDTO[]) {
    
    if(dtos.length)
      return this.editMany(dtos);
    
    return this.editCompany(dtos);
  }
    
  async editCompany(dtos: CompanyDTO[]){
      
      const dto = json(dtos);
      const jobs = dto.jobs;
      const company = await this.model.findByIdAndUpdate(dto._id, dto, { $push: { jobs }, new: true }).populate("jobs");
      return company;
  }

  async editMany(dtos: CompanyDTO[]): Promise<Company[]> {

    let companies: Company[] = [];

    for await (const company of dtos) {
      const jobs = company.jobs;
      const updated = await this.model.findByIdAndUpdate(company._id, company, { $push: { jobs }, new: true }).populate("jobs");
      companies.push(updated);
    }

    return companies;
  }

  /*************************** delete ***************************/

  async delete(id): Promise<void> {
    
    const company = await this.model.findById(id).populate("jobs");

    if(!company)
      throw new NotFoundException("Company not found!");

    const jobs = company.jobs.filter( job => job.status === true);
    
    if(jobs.length > 0)
      throw new PreconditionFailedException("Empresa possui vagas ativas e não pode ser excluída!");
      
    await this.model.findByIdAndRemove(id);
  }

  async deleteMany(ids: string[]): Promise<string[]> {

    let companies = [];

    const promises = ids.map( async (id) =>  {
      
      const company = await this.model.findById(id).populate('jobs');

      if(!company)
        companies.push(id+": Company not found!");

      const jobs = company?.jobs.filter( job => job.status === true);
      
      if(jobs?.length > 0)
        companies.push(id+ ": Company can't be delete!");      
      else if(company)   
        await this.model.findByIdAndRemove(id);
    });

    await Promise.all(promises);

    return companies;
  }
}