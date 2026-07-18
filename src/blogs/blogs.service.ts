import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepo: Repository<Blog>,
    @InjectRepository(Comment)
    private commentsRepo: Repository<Comment>,
  ) {}

  async create(userId: number, dto: CreateBlogDto) {
    return this.blogsRepo.save(this.blogsRepo.create({ ...dto, userId }));
  }

  async findAll(userId: number, page = 1, limit = 10) {
    const [items, total] = await this.blogsRepo.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findOne(userId: number, id: number) {
    const blog = await this.blogsRepo.findOne({ where: { id, userId } });
    if (!blog) throw new NotFoundException('Blog post not found');
    return blog;
  }

  async findPublic(page = 1, limit = 10, sort = 'newest') {
    const order =
      sort === 'oldest'
        ? { createdAt: 'ASC' as const }
        : sort === 'title'
          ? { title: 'ASC' as const }
          : { createdAt: 'DESC' as const };
    const [items, total] = await this.blogsRepo.findAndCount({
      where: { published: true },
      relations: { comments: true },
      skip: (page - 1) * limit,
      take: limit,
      order,
    });
    return { items, total, page, limit, sort };
  }

  async findPublicOne(id: number) {
    const blog = await this.blogsRepo.findOne({
      where: { id, published: true },
      relations: { comments: true },
    });
    if (!blog) throw new NotFoundException('Published blog post not found');
    return blog;
  }

  async addComment(userId: number, blogId: number, dto: CreateCommentDto) {
    await this.findPublicOne(blogId);
    return this.commentsRepo.save(this.commentsRepo.create({ ...dto, blogId, userId }));
  }

  async removeComment(userId: number, commentId: number) {
    const comment = await this.commentsRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('You can only delete your own comments');
    await this.commentsRepo.remove(comment);
    return { id: commentId };
  }

  async update(userId: number, id: number, dto: UpdateBlogDto) {
    const blog = await this.findOne(userId, id);
    Object.assign(blog, dto);
    return this.blogsRepo.save(blog);
  }

  async remove(userId: number, id: number) {
    const blog = await this.findOne(userId, id);
    await this.blogsRepo.remove(blog);
    return { id };
  }
}
