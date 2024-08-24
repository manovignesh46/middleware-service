import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EndpointName } from './endpoint-name.enum';
import { IIntegratorErrorMapping } from './integrator-error-mapping.interface';
import { BaseEntity } from '../../infrastructure/entities/base.entity';
import { IntegratorName } from './IntegratorName.enum';
import { IntegratorErrorType } from './integrator-error-type.enum';

@Entity()
export class IntegratorErrorMappingEntity
  extends BaseEntity
  implements IIntegratorErrorMapping
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: IntegratorName })
  integratorName: IntegratorName;

  @Column({ enum: EndpointName })
  endpointName: EndpointName;

  @Column({ type: 'int', nullable: true })
  receivedHttpCode: number;

  @Column({ type: 'int', nullable: true })
  receivedResponseStatusCode: number;

  @Column({ nullable: true })
  receivedRejectionOrErrorCode: string;

  @Column({ nullable: true })
  receivedErrorDescription: string;

  @Column()
  mappedErrorCode: string;

  @Column()
  mappedErrorMessage: string;

  @Column({
    enum: IntegratorErrorType,
    default: IntegratorErrorType.TECHINICAL,
  })
  errorType: IntegratorErrorType;
}
