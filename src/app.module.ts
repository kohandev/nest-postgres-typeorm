import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from 'src/db/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
