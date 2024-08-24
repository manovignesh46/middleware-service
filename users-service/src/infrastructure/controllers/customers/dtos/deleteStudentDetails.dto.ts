import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteStudentDetailsDTO {
  @IsString()
  @ApiProperty()
  studentId: string;

  @IsString()
  @ApiProperty()
  studentRegnNum: string;
}
