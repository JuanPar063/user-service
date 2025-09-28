import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id_profile: string;

  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 20 })
  document_type: string;

  @Column({ type: 'text' })
  document_number: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  constructor(data: Partial<Profile>) {
    Object.assign(this, data);
  }
}