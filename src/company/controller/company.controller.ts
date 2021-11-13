
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { CompanyService } from '../service/company.service';
import { CompanyDTO } from '../dto/company.dto';
import { ValidateObjectId } from '../../shared/pipes/validate-object-id.pipes';

@Controller()
export class CompanyController {

  constructor(private service: CompanyService) { }
  
  @Get('companies')
  async getCompanies(@Res() res) {
    
    const companies = await this.service.getCompanies();
    return res.status(HttpStatus.OK).json(companies);
  }

  @Get('companiesActived')
  async getCompaniesActived(@Res() res) {
    
    const companies = await this.service.getCompaniesActived();
    return res.status(HttpStatus.OK).json(companies);
  }

  @Get('companiesByJob')
  async getCompaniesByJob(@Res() res, @Query('jobName') jobName) {
    
    const companies = await this.service.getCompaniesByJob(jobName);
    return res.status(HttpStatus.OK).json(companies);
  }

  @Get('company/:id')
  async getCompany(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    const company = await this.service.get(id);
    if (!company) {
        throw new NotFoundException('Company does not exist!');
    }
    return res.status(HttpStatus.OK).json(company);
  }

  @Post('company')
  async create(@Res() res, @Body() dto: CompanyDTO) {
    
    const company = await this.service.create(dto);
    return res.status(HttpStatus.OK).json({
      message: 'Company has been created successfully!',
      company: company
    });
  }

  @Post('companies')
  async createMany(@Res() res, @Body('') dto: CompanyDTO[]) {
    
    const companies = await this.service.createMany(dto);
    return res.status(HttpStatus.OK).json({
      message: 'Companies has been created successfully!',
      companies: companies
    });
  }

  @Put('company')
  async edit(@Res() res, @Body() dto: CompanyDTO) {
    
    const company = await this.service.edit(dto);
    
    return res.status(HttpStatus.OK).json({
      message: 'Company has been successfully updated',
      company: company
    });
  }

  @Put('companies')
  async editMany(@Res() res, @Body() dto: CompanyDTO[]) {
    
    const companies = await this.service.editMany(dto);
    
    return res.status(HttpStatus.OK).json({
      message: 'Companies has been successfully updated',
      companies: companies
    });
  }
    
  @Delete('company/:id')
  async delete(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    await this.service.delete(id);
    return res.status(HttpStatus.OK).json({message: 'Company has been deleted!'});
  }
    
  @Delete('companies')
  async deleteMany(@Res() res, @Body() ids: string[]) {

    const companies = await this.service.deleteMany(ids);
    return res.status(HttpStatus.OK).json({
      message: 'Companies has been deleted!',
      companies: companies
    });
  }
}
