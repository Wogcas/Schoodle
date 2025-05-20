import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { SyncUserDto } from './sync.dto';
import { ISyncService } from './sync.interface';

@Injectable()
export class SyncService implements ISyncService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async syncUser(syncUserDto: SyncUserDto) {
    const existingUser = await this.userRepository.findOne({ 
      where: [{ email: syncUserDto.email }, { idNumber: syncUserDto.idNumber }] 
    });

    if (existingUser) {
      // Actualizar usuario existente
      existingUser.firstName = syncUserDto.firstName;
      existingUser.lastName = syncUserDto.lastName;
      existingUser.role = syncUserDto.role;
      if (syncUserDto.password) {
        existingUser.password = await bcrypt.hash(syncUserDto.password, 10);
      }
      return this.userRepository.save(existingUser);
    }

    // Crear nuevo usuario
    const newUser = new User();
    newUser.email = syncUserDto.email;
    newUser.password = await bcrypt.hash(syncUserDto.password, 10);
    newUser.firstName = syncUserDto.firstName;
    newUser.lastName = syncUserDto.lastName;
    newUser.idNumber = syncUserDto.idNumber;
    newUser.role = syncUserDto.role;

    return this.userRepository.save(newUser);
  }

  // Métodos adicionales que podrían ser necesarios para otros servicios
  async getUserByEmail(email: string): Promise<User | undefined> {
    return (await this.userRepository.findOne({ where: { email } })) ?? undefined;
  }

  async getUserByIdNumber(idNumber: string): Promise<User | undefined> {
    return (await this.userRepository.findOne({ where: { idNumber } })) ?? undefined;
  }
}