import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestionModule } from './ingestion/ingestion.module';

@Module({
  imports: [
    // Database connection. Use environment variables in production.
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/dhl-logistics'),
    IngestionModule,
  ],
})
export class AppModule {}
