import { Role } from 'src/enums/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id?: number;

  @Column({
    length: 60,
  })
  name: string;

  @Column({
    length: 60,
    unique: true,
  })
  email: string;

  @Column({
    length: 60,
    // select: false,
  })
  password: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthAt?: Date;

  @Column({ default: Role.User })
  role: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
