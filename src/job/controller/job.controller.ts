
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Delete } from '@nestjs/common';
import { JobService } from '../service/job.service';
import { JobDTO } from '../dto/job.dto';
import { ValidateObjectId } from '../../shared/pipes/validate-object-id.pipes';

@Controller()
export class JobController {

  constructor(private service: JobService) { }
  
  @Get('jobs')
  async getJobs(@Res() res) {
    
    const jobs = await this.service.getJobs();
    return res.status(HttpStatus.OK).json(jobs);
  }
  
  @Get('jobsActived')
  async getJobsActived(@Res() res) {
    
    const jobs = await this.service.getJobsActived();
    return res.status(HttpStatus.OK).json(jobs);
  }

  @Get('job/:id')
  async getJob(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    const job = await this.service.get(id);
    if (!job) {
        throw new NotFoundException('Job does not exist!');
    }
    return res.status(HttpStatus.OK).json(job);
  }

  @Post('job')
  async create(@Res() res, @Body() dto: JobDTO) {
    
    const job = await this.service.create(dto);
    return res.status(HttpStatus.OK).json({
      message: 'Job has been created successfully!',
      job: job,
    });
  }

  @Post('jobs')
  async createMany(@Res() res, @Body() dtos: JobDTO[]) {
    
    const jobs = await this.service.createMany(dtos);
    return res.status(HttpStatus.OK).json({
      message: 'Jobs has been created successfully!',
      jobs: jobs,
    });
  }

  @Put('job')
  async edit(@Res() res, @Body() dto: JobDTO) {
    
    const job = await this.service.edit(dto);
    
    return res.status(HttpStatus.OK).json({
      message: 'Job has been successfully updated',
      job: job,
    });
  }

  @Put('jobs')
  async editMany(@Res() res, @Body() dtos: JobDTO[]) {
    
    const jobs = await this.service.editMany(dtos);
    
    return res.status(HttpStatus.OK).json({
      message: 'Jobs has been successfully updated',
      jobs: jobs,
    });
  }
    
  @Delete('job/:id')
  async delete(@Res() res, @Param('id', new ValidateObjectId()) id) {
    
    await this.service.delete(id);
    return res.status(HttpStatus.OK).json({message: 'Job has been deleted!'});
  }
    
  @Delete('jobs')
  async deleteMany(@Res() res, @Body() ids: string[]) {
    
    const jobs = await this.service.deleteMany(ids);
    return res.status(HttpStatus.OK).json({
      message: 'Jobs has been deleted!',
      jobs: jobs
    });
  }
}