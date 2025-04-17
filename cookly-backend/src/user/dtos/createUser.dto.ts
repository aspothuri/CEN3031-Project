import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  followers: string[];

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  following: string[];
}
