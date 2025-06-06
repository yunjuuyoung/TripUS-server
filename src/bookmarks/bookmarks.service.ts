import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { LandmarksService } from 'src/landmarks/landmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkStatusResponseDto } from './dto/bookmark-status-response.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    private landmarkService: LandmarksService,
  ) {}

  async create(
    user: User,
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark | null> {
    try {
      const landmark_id = createBookmarkDto.landmark_id;
      const landmark = await this.landmarkService.findOne(landmark_id);
      if (!landmark) {
        throw new NotFoundException('Landmark not found');
      }

      const exsitingBookmark = await this.bookmarkRepository.findOne({
        where: { user_id: user.id, landmark_id },
      });
      if (exsitingBookmark) {
        throw new ConflictException('Bookmark already exists');
      }

      const bookmark = this.bookmarkRepository.create({
        user,
        user_id: user.id,
        landmark,
        landmark_id,
      });
      return await this.bookmarkRepository.save(bookmark);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ConflictException) {
        throw e;
      }
      throw new InternalServerErrorException('Failed to create bookmark');
    }
  }

  async find(user_id: number): Promise<Bookmark[]> {
    return await this.bookmarkRepository.find({
      where: { user_id, is_marked: true },
    });
  }

  async findOne(
    user_id: number,
    landmark_id: number,
  ): Promise<BookmarkStatusResponseDto> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { user_id, landmark_id },
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return { is_marked: bookmark.is_marked };
  }

  async update(
    user_id: number,
    landmark_id: number,
  ): Promise<BookmarkStatusResponseDto> {
    try {
      const bookmark = await this.bookmarkRepository.findOne({
        where: { user_id, landmark_id },
      });
      if (!bookmark) {
        throw new NotFoundException('Bookmark not found');
      }

      bookmark.is_marked = !bookmark.is_marked;
      await this.bookmarkRepository.save(bookmark);

      return { is_marked: bookmark.is_marked };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException(
        'Failed to change bookmark status',
      );
    }
  }
}
