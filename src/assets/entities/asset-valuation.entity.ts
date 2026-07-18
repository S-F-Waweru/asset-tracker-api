import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Asset } from './asset.entity';

@Entity()
export class AssetValuation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  value: number;

  @CreateDateColumn()
  recordedAt: Date;

  @Column()
  assetId: number;

  @ManyToOne(() => Asset, (asset) => asset.valuations)
  asset: Asset;
}
