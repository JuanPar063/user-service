import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id_profile: string;

  @Column('uuid')
  id_user: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 20 })
  document_type: string;

  @Column({ type: 'text' })
  document_number: string;

  @Column({ type: 'text', unique: true }) // Agregamos unique aquí también
  phone: string;

  @Column({ type: 'text' })
  address: string;

  
  @Column({ 
    type: 'decimal', 
    precision: 12, 
    scale: 2, 
    nullable: true,
    name: 'monthly_income' 
  })
  monthly_income?: number;


  constructor(data?: Partial<Profile>) {
    if (data) {
      // NO asignamos id_profile si viene en data, dejamos que se genere automáticamente
      const { id_profile, ...rest } = data;
      Object.assign(this, rest);
    }
  }
}