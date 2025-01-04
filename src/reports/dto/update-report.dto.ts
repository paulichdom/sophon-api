import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsBoolean } from 'class-validator';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @IsBoolean()
  approved: boolean;
}
