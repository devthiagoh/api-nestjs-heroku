
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { CompanyService } from '../service/company.service';
import { CompanyDTO } from '../dto/company.dto';
import { ValidateObjectId } from '../../pipes/validate-object-id.pipes';

@Controller('companies')
export class CompanyController {

  constructor(private service: CompanyService) { }
  
  @Get()
  async getCompanies(@Res() res, @Query('params') params:Map<string, string>) {

    const companies = await this.service.findAll(params);
    return res.status(HttpStatus.OK).json(companies);
  }

  @Get(':id')
  async getCompany(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    const company = await this.service.get(id);
    return res.status(HttpStatus.OK).json(company);
  }

  @Post()
  async create(@Res() res, @Body() dto: CompanyDTO[]) {

    const companies = await this.service.create(dto);
    return res.status(HttpStatus.OK).json(companies);
  }

  @Put()
  async edit(@Res() res, @Body() dto: CompanyDTO[]) {
    
    const companies = await this.service.edit(dto);    
    return res.status(HttpStatus.OK).json(companies);
  }
    
  @Delete(':id')
  async delete(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    await this.service.delete(id);
    return res.status(HttpStatus.OK).json({message: 'Company has been deleted!'});
  }
    
  @Delete()
  async deleteMany(@Res() res, @Body() ids: string[]) {

    const companies = await this.service.deleteMany(ids);
    return res.status(HttpStatus.OK).json({
      message: 'Companies has been deleted!',
      companies: companies
    });
  }
}
