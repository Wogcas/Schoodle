import { Module } from '@nestjs/common';
import { SyncModule } from './sync/sync.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [LoginModule, SyncModule],
})
export class AuthModule {}