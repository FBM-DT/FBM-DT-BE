import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateInventoryReqDto, UpdateInventoryReqDto } from './dto/request';
import {
  AddInventoryResDto,
  DeleteInventoryResDto,
  GetAllInventoryResDto,
  GetInventoryResDto,
  UpdateInventoryResDto,
} from './dto/response';
import { Auth } from '@BE/core/utils/decorators';

@Controller('inventory')
@ApiTags('Inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('create')
  @ApiOperation({ description: 'Create a new Inventory' })
  @ApiCreatedResponse({ type: CreateInventoryReqDto })
  @HttpCode(201)
  @Auth()
  async createInventory(
    @Body() InventoryDto: CreateInventoryReqDto,
  ): Promise<AddInventoryResDto> {
    const response: AddInventoryResDto =
      await this.inventoryService.createInventory(InventoryDto);
    return response;
  }

  @Get('list')
  @ApiOkResponse({ type: CreateInventoryReqDto, isArray: true })
  @HttpCode(200)
  @Auth()
  async findAllInventories(): Promise<GetAllInventoryResDto> {
    const response: GetAllInventoryResDto =
      await this.inventoryService.getAllInventories();
    return response;
  }

  @Get('findOne/:id')
  @ApiOkResponse({ type: CreateInventoryReqDto })
  @HttpCode(200)
  @Auth()
  async findAInventoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetInventoryResDto> {
    const response: GetInventoryResDto =
      await this.inventoryService.getInventoryById(id);

    return response;
  }

  @Get('findAccount/:id')
  @ApiOkResponse({ type: CreateInventoryReqDto })
  @HttpCode(200)
  @Auth()
  async findInventoryByAccountId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetInventoryResDto> {
    const response: GetInventoryResDto =
      await this.inventoryService.getInventoryByAccountId(id);

    return response;
  }

  @Patch('update/:id')
  @ApiOkResponse({ type: CreateInventoryReqDto })
  @HttpCode(200)
  @Auth()
  async updateInventoryById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryReqDto,
  ): Promise<UpdateInventoryResDto> {
    const response: UpdateInventoryResDto =
      await this.inventoryService.updateInventoryById(id, updateInventoryDto);

    return response;
  }

  @Delete('delete/:id')
  @ApiOkResponse({ type: CreateInventoryReqDto })
  @HttpCode(200)
  @Auth()
  async removeInventoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteInventoryResDto> {
    const response: DeleteInventoryResDto =
      await this.inventoryService.deleteInventoryById(id);

    return response;
  }
}
