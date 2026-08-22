import { IsEmail } from 'class-validator';

export class UnsubscribeDto {
  @IsEmail()
  email!: string;
}
