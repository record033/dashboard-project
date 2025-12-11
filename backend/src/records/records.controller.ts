import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { AtGuard } from '../common/guards/at.guard';
import { GetCurrentUser } from '../common/decorators/get-current-user-decorator';

@UseGuards(AtGuard)
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create(
    @GetCurrentUser('sub') userId: number, 
    @Body() createRecordDto: CreateRecordDto
  ) {
    return this.recordsService.create(userId, createRecordDto);
  }

  @Get()
  findAll(@GetCurrentUser('sub') userId: number, 
  @GetCurrentUser('role') role: string)
   {
    return this.recordsService.findAll(userId, role);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('role') role: string
  ) {
    return this.recordsService.findOne(id, userId, role);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('role') role: string
  ) {
    return this.recordsService.remove(id, userId, role);
  }
}