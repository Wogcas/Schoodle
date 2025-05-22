import { Controller, Post, Body, UnauthorizedException, Headers } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncUserDto } from './sync.dto';

@Controller('auth/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) { }

  @Post('user')
  async syncUser(
    @Body() syncUserDto: SyncUserDto,
    @Headers('x-api-key') apiKey: string
  ) {
    if (apiKey !== process.env.JWT_SECRET) {
      throw new UnauthorizedException('Invalid API key');
    }
    return this.syncService.syncUser(syncUserDto);
  }

  @Post('create')
  async createUser(
    @Body() syncUserDto: SyncUserDto,
    @Headers('x-api-key') apiKey: string
  ) {
    if (apiKey !== process.env.JWT_SECRET) {
      throw new UnauthorizedException('Invalid API key');
    }
    return this.syncService.createUser(syncUserDto);
  }
}