import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { BlogsService } from './blogs.service';

@UseInterceptors(TransformInterceptor)
@ApiTags('Public blogs')
@Controller('blogs/public')
export class PublicBlogsController {
  constructor(private blogsService: BlogsService) {}

  @Get('feed')
  @ApiOperation({ summary: 'List published blog posts for public platforms' })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['newest', 'oldest', 'title'], example: 'newest' })
  @ApiOkResponse({ description: 'Published blog posts, with their comments.' })
  findAll(@Query('page') page = '1', @Query('limit') limit = '10', @Query('sort') sort = 'newest') {
    return this.blogsService.findPublic(parseInt(page, 10), parseInt(limit, 10), sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a published blog post and its comments' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Published blog post was not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.findPublicOne(id);
  }
}
