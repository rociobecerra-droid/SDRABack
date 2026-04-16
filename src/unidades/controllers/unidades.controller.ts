import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { GenericController } from 'src/generic/generic.controller';
import { Unidades } from '../entities/unidades.entity';
import { UnidadesService } from '../services/unidades.service';
import { UpdateUnidadDto } from '../dtos/update-unidad.dto';

@Controller('unidades')
export class UnidadesController extends GenericController<Unidades, UnidadesService> {
    constructor(private readonly unidadesService: UnidadesService) {
        super(unidadesService);
    }

    @Get()
    async findAll(): Promise<Unidades[]> {
        return this.unidadesService.find();
    }

    @Post()
    async create(@Body() entity: Unidades) {
        return this.unidadesService.create(entity);
    }

    @Put(':id')
    async updateUnit(@Param('id') id: number, @Body() updateUnidadDto: UpdateUnidadDto) {
        return this.unidadesService.update(id, updateUnidadDto);
    }

    @Get('materia/:idMateria')
    async findByMateria(@Param('idMateria') idMateria: number): Promise<Unidades[]> {
        return this.unidadesService.findByMateriaId(idMateria);
    }

    @Get(':id/with-temas')
    async findWithTemas(@Param('id') id: number): Promise<Unidades> {
        return this.unidadesService.findWithTemas(id);
    }
}