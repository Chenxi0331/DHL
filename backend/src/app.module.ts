import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { IngestionModule } from './ingestion/ingestion.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables accessible everywhere
    }),
    // Database connection. Use environment variables in production.
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/dhl-logistics'),
    IngestionModule,
    AuthModule,
  ],
})
export class AppModule {}
