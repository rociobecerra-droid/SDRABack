import { Controller, Get, Post, Body, Param, Delete, Put, Patch, BadRequestException } from '@nestjs/common';
import { GenericController } from 'src/generic/generic.controller';
import { EstiloObjeto } from '../entities/estilo_objeto.entity';
import { EstiloObjetoService } from '../services/estilo-objeto.service';

@Controller('estilo-objeto')
export class EstiloObjetoController extends GenericController<EstiloObjeto, EstiloObjetoService> {
    constructor(private readonly estiloObjetoService: EstiloObjetoService) {
        super(estiloObjetoService);
    }

    @Get()
    async findAll(): Promise<EstiloObjeto[]> {
        return this.estiloObjetoService.findAllStyles();
    }

    @Post()
    async create(@Body() entity: EstiloObjeto) {
        return this.estiloObjetoService.create(entity);
    }

    @Get('objeto/:objeto')
    async findByObjeto(@Param('objeto') objeto: string): Promise<EstiloObjeto> {
        const result = await this.estiloObjetoService.findByObjeto(objeto);
        
        if (!result) {
            throw new BadRequestException(`No se encontró un objeto con el nombre: ${objeto}`);
        }
        
        return result;
    }

    @Get('estilo/:estilo')
    async findByEstilo(@Param('estilo') estilo: string): Promise<EstiloObjeto[]> {
        return this.estiloObjetoService.findByEstilo(estilo);
    }

    @Post(':id/agregar-estilo')
    async addEstilo(
        @Param('id') id: number,
        @Body() body: { estilo: string }
    ): Promise<EstiloObjeto> {
        if (!body.estilo) {
            throw new BadRequestException('El campo "estilo" es requerido');
        }
        
        return this.estiloObjetoService.addEstiloToObjeto(id, body.estilo);
    }

    @Delete(':id/remover-estilo')
    async removeEstilo(
        @Param('id') id: number,
        @Body() body: { estilo: string }
    ): Promise<EstiloObjeto> {
        if (!body.estilo) {
            throw new BadRequestException('El campo "estilo" es requerido');
        }
        
        return this.estiloObjetoService.removeEstiloFromObjeto(id, body.estilo);
    }
}