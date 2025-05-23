import { OmitType } from '@nestjs/mapped-types';
import { CreateLikeDto } from './create-like.dto';

export class GetLikesDto extends OmitType(CreateLikeDto, [
  'user_id',
] as const) {}
