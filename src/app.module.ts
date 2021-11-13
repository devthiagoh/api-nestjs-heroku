import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';

@Module({
  imports: [ MongooseModule.forRoot('mongodb+srv://devthiagoh:sMAfpyhuIIk6TkdM@cluster0.ldrli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }), CompanyModule, JobModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
