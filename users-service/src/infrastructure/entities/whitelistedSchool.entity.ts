import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IWhitelistedSchool } from '../../domain/model/whitelistedSchool.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class WhitelistedSchool
  extends BaseEntity
  implements IWhitelistedSchool
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 250 })
  schoolName: string;

  @Column({ length: 100, nullable: true })
  district: string;

  @Column({ nullable: true })
  emisCode: number;

  @Column({ length: 5, nullable: true })
  countryCode: string;
}
