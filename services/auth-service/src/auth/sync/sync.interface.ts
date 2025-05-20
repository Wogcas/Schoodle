import { SyncUserDto } from './sync.dto';
import { User } from './entities/user.entity';

export interface ISyncService {
  syncUser(syncUserDto: SyncUserDto): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByIdNumber(idNumber: string): Promise<User | undefined>;
}