import { Module } from '@nestjs/common';
import { ApiFeaturesUsersService } from './api-features-users.service';

@Module({
  controllers: [],
  providers: [ApiFeaturesUsersService],
  exports: [ApiFeaturesUsersService],
})
export class ApiFeaturesUsersModule {}
