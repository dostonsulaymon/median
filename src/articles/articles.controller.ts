import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity })
  findDrafts() {
    return this.articlesService.findDrafts();
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity })
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ArticleEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    console.log('hello');
    return this.articlesService.remove(id);
  }
}
