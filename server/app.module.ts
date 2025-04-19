
import { Module } from '@nestjs/common';
import { ExamsModule } from './modules/exams/exams.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ExamsModule,
    ActivitiesModule, 
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}
