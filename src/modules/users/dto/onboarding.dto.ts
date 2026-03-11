import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExperienceLevel } from '../schemas/user.schema';

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['beginner', 'casual', 'competitive'];

export class LocationDto {
  @ApiProperty({ example: 'Point' })
  @IsString()
  type: 'Point';

  @ApiProperty({ example: [-3.7038, 40.4168] })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class OnboardingDto {
  @ApiPropertyOptional({ example: ['warhammer40k', 'age-of-sigmar'] })
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
