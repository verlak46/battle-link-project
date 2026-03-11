import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExperienceLevel } from '../schemas/user.schema';
import { LocationDto } from './onboarding.dto';

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['beginner', 'casual', 'competitive'];

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: ['warhammer40k'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteGames?: string[];

  @ApiPropertyOptional({ enum: EXPERIENCE_LEVELS })
  @IsOptional()
  @IsEnum(EXPERIENCE_LEVELS)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({ type: LocationDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
