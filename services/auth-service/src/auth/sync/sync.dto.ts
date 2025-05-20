import { IsEmail, IsNotEmpty } from 'class-validator';

export class SyncUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  idNumber: string;

  @IsNotEmpty()
  role: string;
}