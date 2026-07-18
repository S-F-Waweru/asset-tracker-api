import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { AssetValuation } from './asset-valuation.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('float')
  quantity: number;

  @Column('float')
  purchasePrice: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.assets)
  user: User;

  @OneToMany(() => AssetValuation, (valuation) => valuation.asset)
  valuations: AssetValuation[];

  @CreateDateColumn()
  createdAt: Date;
}
