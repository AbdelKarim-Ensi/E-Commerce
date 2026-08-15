import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update.address.dto';

// Toutes les routes sont scoped à l'utilisateur connecté — pas de route
// admin ici, chacun ne gère que son propre carnet d'adresses.
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.addressesService.findAllForUser(userId);
  }

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(userId, id, dto);
  }

  @Patch(':id/default')
  setDefault(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.addressesService.setDefault(userId, id);
  }

  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.addressesService.remove(userId, id);
  }
}