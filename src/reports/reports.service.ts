import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {Report} from './entities/report.entity'
import { User } from 'src/users/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GetEstimateDto } from './dto/get-estimate';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate(estimateDto: GetEstimateDto) {
    return this.repo.createQueryBuilder()
    .select('*')
    .where('make = :make', {make: estimateDto.make})
    .getRawMany()
  }

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.repo.create(createReportDto);
    report.user = user;
    return this.repo.save(report);
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.repo.findOne({ where: { id: id }});

    if(!report) {
      throw new NotFoundException("Report not found");
    }

    report.approved = updateReportDto.approved
    return this.repo.save(report);
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
