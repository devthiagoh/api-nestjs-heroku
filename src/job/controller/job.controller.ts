
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { JobService } from '../service/job.service';
import { JobDTO } from '../dto/job.dto';
import { ValidateObjectId } from '../../pipes/validate-object-id.pipes';

@Controller('jobs')
export class JobController {

  constructor(private service: JobService) { }
  
  @Get()
  async getJobs(@Res() res, @Query('params') params:Map<string, string>) {
    
    const jobs = await this.service.findAll(params);
    return res.status(HttpStatus.OK).json(jobs);
  }

  @Get(':id')
  async getJob(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    const job = await this.service.get(id);
    return res.status(HttpStatus.OK).json(job);
  }

  @Post()
  async create(@Res() res, @Body() dto: JobDTO) {
    
    const jobs = await this.service.create(dto);
    return res.status(HttpStatus.OK).json(jobs);
  }

  @Post('/many')
  async createMany(@Res() res, @Body() dtos: JobDTO[]) {
    
    const jobs = await this.service.createMany(dtos);
    return res.status(HttpStatus.OK).json(jobs);
  }

  @Put()
  async edit(@Res() res, @Body() dto: JobDTO) {
    
    const job = await this.service.edit(dto);    
    return res.status(HttpStatus.OK).json(job);
  }

  @Put('/many')
  async editMany(@Res() res, @Body() dtos: JobDTO[]) {
    
    const jobs = await this.service.editMany(dtos);
    return res.status(HttpStatus.OK).json(jobs);
  }
    
  @Delete(':id')
  async delete(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    await this.service.delete(id);
    return res.status(HttpStatus.OK).json({message: 'Job has been deleted!'});
  }
    
  @Delete()
  async deleteMany(@Res() res, @Body() ids: string[]) {
    
    const jobs = await this.service.deleteMany(ids);
    return res.status(HttpStatus.OK).json({
      message: 'Jobs has been deleted!',
      jobs: jobs
    });
  }
}