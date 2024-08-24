import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICustScoringData } from '../../domain/model/custScoringData.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustScoringData extends BaseEntity implements ICustScoringData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadId: string;

  @Column()
  employmentNature: string;

  @Column({ nullable: true })
  monthlyGrossIncome: string;

  @Column({ nullable: true })
  activeBankAccount: string;

  @Column({ nullable: true })
  yearsInCurrentPlace: string;

  @Column()
  maritalStatus: string;

  @Column({ nullable: true })
  numberOfSchoolKids: string;

  @Column({ nullable: true })
  creditScore: number;

  @Column({ nullable: true })
  prequalifiedAmount: string;

  constructor(
    leadId: string,
    employmentNature: string,
    monthlyGrossIncome: string,
    activeBankAccount: string,
    yearsInCurrentPlace: string,
    maritalStatus: string,
    numberOfSchoolKids: string,
  ) {
    super();
    this.leadId = leadId;
    this.employmentNature = employmentNature;
    this.monthlyGrossIncome = monthlyGrossIncome;
    this.activeBankAccount = activeBankAccount;
    this.yearsInCurrentPlace = yearsInCurrentPlace;
    this.numberOfSchoolKids = numberOfSchoolKids;
    this.maritalStatus = maritalStatus;
  }
}
