import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Firebase ID token obtenido desde el cliente' })
  @IsString()
  token: string;
}
