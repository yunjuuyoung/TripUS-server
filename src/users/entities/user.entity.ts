import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Polaroid } from 'src/polaroids/entities/polaroid.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('varchar', {
    length: 50,
    unique: true,
    nullable: true,
    name: 'username',
  })
  username?: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
    name: 'email',
  })
  email: string;

  @Column('varchar', { length: 255, nullable: true, name: 'password' })
  password?: string;

  @Column('longtext', { nullable: true, name: 'profile_image' })
  profile_image?: string;

  @Column('varchar', { length: 100, nullable: true, name: 'status' })
  status_message?: string;

  @CreateDateColumn({ name: 'created_at' })
  'created_at': Date;

  @OneToMany(() => Polaroid, (polaroid) => polaroid.user)
  polaroids?: Polaroid[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks?: Bookmark[];

  @BeforeInsert()
  private beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
