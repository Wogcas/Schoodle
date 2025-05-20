import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncUserDto } from './sync.dto';
import { AuthGuard } from 'src/shared/guard/auth.guard';

@Controller('auth/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('user')
  @UseGuards(AuthGuard)
  async syncUser(@Body() syncUserDto: SyncUserDto) {
    return this.syncService.syncUser(syncUserDto);
  }
}