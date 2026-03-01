import { Controller, Get, Post, Body, Param, BadRequestException, UseInterceptors, UploadedFile, Put, Delete, Res } from '@nestjs/common';
import { GenericController } from 'src/generic/generic.controller';
import { ObjetosAprendizaje } from '../entities/objetos_aprendizaje.entity';
import { ObjetosAprendizajeService } from '../services/objetos-aprendizaje.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateObjetoAprendizajeDto } from '../dtos/create-objeto-aprendizaje.dto';

@Controller('objetos-aprendizaje')
export class ObjetosAprendizajeController extends GenericController<ObjetosAprendizaje, ObjetosAprendizajeService> {
    constructor(
        private readonly objetosAprendizajeService: ObjetosAprendizajeService,
        private readonly cloudinaryService: CloudinaryService   
    ) {
        super(objetosAprendizajeService);
    }

    @Get()
    async findAll(): Promise<ObjetosAprendizaje[]> {
        return this.objetosAprendizajeService.find();
    }

    //OBJETO DE APRENDIZAJE SIN ARCHIVO, DATOS SOLO EN EL BODY
    @Post()
    async create(@Body() entity: ObjetosAprendizaje) {
        return this.objetosAprendizajeService.create(entity);
    }

    /**
     * Crear objeto de aprendizaje con archivo
     *  Sube el archivo a Cloudinary y guarda la URL en la base de datos en el campo 'contenido'
     */

    @Post('upload')
@UseInterceptors(FileInterceptor('file'))
async createWithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Partial<CreateObjetoAprendizajeDto>
) {
    if (!file) {
        throw new BadRequestException('Archivo no proporcionado');
    }

    try {
        //Usar el nuevo método del servicio
        return await this.objetosAprendizajeService.createWithFile(body, file);
    } catch (error) {
        throw new BadRequestException(`Error al subir el archivo: ${error.message}`);
    }
}

    @Get('tema/:idTema')
    async findByTema(@Param('idTema') idTema: number): Promise<ObjetosAprendizaje[]> {
        return this.objetosAprendizajeService.findByTemaId(idTema);
    }

    @Get('tema/:idTema/count')
    async countByTema(@Param('idTema') idTema: number): Promise<{ count: number }> {
        const count = await this.objetosAprendizajeService.countByTemaId(idTema);
        return { count };
    }

    /**
 * Actualizar objeto de aprendizaje con nuevo archivo
 */
@Put('upload/:id')
@UseInterceptors(FileInterceptor('file'))
async updateWithFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Partial<CreateObjetoAprendizajeDto>
) {
    try {
        //Usar el nuevo método del servicio
        return await this.objetosAprendizajeService.updateWithFile(id, body, file);
    } catch (error) {
        throw new BadRequestException(`Error al actualizar el archivo: ${error.message}`);
    }
}

/**
 *
 * GET /objetos-aprendizaje/:id/download-url
 */
@Get(':id/download-url')
async getDownloadUrl(@Param('id') id: number) {
    try {
        return await this.objetosAprendizajeService.getDownloadUrl(id);
    } catch (error) {
        throw new BadRequestException(error.message);
    }
}

    /**
     * Eliminar objeto de aprendizaje y su archivo en Cloudinary
     */
    @Delete(':id/full')
    async deleteWithFile(@Param('id') id: number) {
        try {
            return await this.objetosAprendizajeService.deleteWithFile(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}