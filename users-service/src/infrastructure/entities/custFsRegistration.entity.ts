import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ICustFsRegistration } from '../../domain/model/custFsRegistration.interface';
import { BaseEntity } from './base.entity';

@Entity()
export class CustFsRegistration
  extends BaseEntity
  implements ICustFsRegistration
{
  @PrimaryColumn()
  custId: string;

  @Column()
  custCountryCode: string;

  @Column()
  custMsisdn: string;

  @Column()
  primaryEmail: string;

  @Column({ type: 'bigint' })
  fsRequesterId: number;

  @Column()
  fsIsActive: boolean;
}
