import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Polaroid } from 'src/polaroids/entities/polaroid.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'landmarks' })
export class Landmark {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('varchar', { length: 100, nullable: false, name: 'name' })
  name: string;

  @Column('text', { nullable: false, name: 'coordinates' })
  coordinates: string;

  @Column('text', { nullable: false, name: 'address' })
  address: string;

  @Column('longtext', { nullable: false, name: 'image' })
  image: string;

  @Column('longtext', { name: 'background_image' })
  background_image: string;

  @Column('longtext', { nullable: false, name: 'symbol' })
  symbol: string;

  @Column('text', { nullable: false, name: 'description' })
  description: string;

  @Column({ default: 0, name: 'likes' })
  likes: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => Polaroid, (polaroid) => polaroid.landmark)
  polaroids?: Polaroid[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.landmark)
  bookmarks?: Bookmark[];
}
