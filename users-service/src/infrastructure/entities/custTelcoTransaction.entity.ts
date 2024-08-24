import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IdType } from '../../domain/enum/id-type.enum';
import { ICustTelcoTransaction } from '../../domain/model/custTelcoTransaction.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustTelcoTransaction
  extends BaseEntity
  implements ICustTelcoTransaction
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idType: IdType;

  @Column()
  idValue: string;

  @Column()
  telcoId: string;

  @Column()
  transactionData: string;

  @Column({ default: false })
  isDataSentToLOS: boolean;

  @Column({ default: true })
  isActive: boolean;
}
