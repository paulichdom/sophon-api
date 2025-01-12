import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfileEntity
    ])
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [TypeOrmModule]
})
export class ProfileModule {}
