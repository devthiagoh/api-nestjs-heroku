import { ConsoleLogger, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyDTO } from '../dto/company.dto';
import { ObjectId } from 'mongodb';
import { Company, CompanyDocument } from '../schema/company.schema';
    
@Injectable()
export class CompanyService {

  constructor(@InjectModel(Company.name) private readonly model: Model<CompanyDocument>) { }
    
  async create(dto: CompanyDTO): Promise<Company> {
    const company = await this.model.create(dto);
    return company.save();
  }

  async createMany(dtos: CompanyDTO[]): Promise<Company[]> {
    const companies = await this.model.insertMany(dtos);
    return companies;
  }  
    
  async get(id): Promise<Company> {
    const company = await this.model.findById(id).exec();
    return company;
  }
    
  async getCompanies(): Promise<Company[]> {
    const companies = (await this.model.find().populate("jobs"));
    return companies;
  }
    
  async getCompaniesActived(): Promise<Company[]> {
    const companies = (await this.model.find().populate("jobs")).filter( company => company.status === true );
    return companies;
  }
    
  async getCompaniesByJob(jobName): Promise<Company[]> {

    const companies = (await this.model.find().populate("jobs"));
    const companiesByJobName = [];
    const promises = companies.map( async company => { 
      await company.jobs.map( async job => { 
        if(job.name === jobName)
          companiesByJobName.push(company);
      });
    });

    await Promise.all(promises);

    return companiesByJobName;
  }

  async edit(dto: CompanyDTO): Promise<Company> {
    const jobs = dto.jobs;
    const company = await this.model.findByIdAndUpdate(dto._id, dto, { $push: { jobs }, new: true });
    return company;
  }

  async editMany(dtos: CompanyDTO[]): Promise<Company[]> {

    let companies: Company[] = [];

    for await (const company of dtos) {
      const jobs = company.jobs;
      const updated = await this.model.findByIdAndUpdate(company._id, company, { $push: { jobs }, new: true });
      companies.push(updated);
    }

    return companies;
  }

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
      
      const company = await this.model.findById(id);

      if(!company)
        companies.push(id+": Company not found!");

      const jobs = company?.jobs.filter( job => job.status === true);
  
      if(jobs?.length > 0)
        companies.push(id+ ": Company can't be delete!");      
      else  
        await this.model.findByIdAndRemove(id);
    });

    await Promise.all(promises);

    return companies;
  }
}