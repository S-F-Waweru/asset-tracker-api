import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformInterceptor)
@ApiTags('Blogs')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing, expired, or invalid bearer token.' })
@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a blog post' })
  @ApiBody({ type: CreateBlogDto })
  @ApiCreatedResponse({ description: 'Blog post created.' })
  create(@CurrentUser() user, @Body() dto: CreateBlogDto) {
    return this.blogsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's blog posts" })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
  @ApiOkResponse({ schema: { example: { items: [], total: 0, page: 1, limit: 10 } } })
  findAll(@CurrentUser() user, @Query('page') page = '1', @Query('limit') limit = '10') {
    return this.blogsService.findAll(user.userId, parseInt(page, 10), parseInt(limit, 10));
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Comment on a published blog post' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ description: 'Comment created.' })
  @ApiNotFoundResponse({ description: 'Published blog post was not found.' })
  addComment(@CurrentUser() user, @Param('id', ParseIntPipe) id: number, @Body() dto: CreateCommentDto) {
    return this.blogsService.addComment(user.userId, id, dto);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete your own comment' })
  @ApiParam({ name: 'commentId', type: Number, example: 1 })
  @ApiForbiddenResponse({ description: 'The comment belongs to another user.' })
  @ApiNotFoundResponse({ description: 'Comment was not found.' })
  removeComment(@CurrentUser() user, @Param('commentId', ParseIntPipe) commentId: number) {
    return this.blogsService.removeComment(user.userId, commentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Blog post was not found.' })
  findOne(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.blogsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateBlogDto })
  @ApiNotFoundResponse({ description: 'Blog post was not found.' })
  update(@CurrentUser() user, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogDto) {
    return this.blogsService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Blog post was not found.' })
  remove(@CurrentUser() user, @Param('id', ParseIntPipe) id: number) {
    return this.blogsService.remove(user.userId, id);
  }
}
