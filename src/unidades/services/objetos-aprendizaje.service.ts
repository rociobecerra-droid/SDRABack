import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { ObjetosAprendizaje } from '../entities/objetos_aprendizaje.entity';
import { CloudinaryService, CloudinaryUploadResult } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ObjetosAprendizajeService extends GenericService<ObjetosAprendizaje> {
    constructor(
        @InjectRepository(ObjetosAprendizaje)
        private readonly objetosAprendizajeRepository: Repository<ObjetosAprendizaje>,
        private readonly cloudinaryService: CloudinaryService
    ) {
        super(objetosAprendizajeRepository);
    }

    async findByTemaId(idTema: number): Promise<ObjetosAprendizaje[]> {
        return this.objetosAprendizajeRepository.find({
            where: { id_tema: idTema },
            relations: ['estiloObjeto']
        });
    }

    async countByTemaId(idTema: number): Promise<number> {
        return this.objetosAprendizajeRepository.count({
            where: { id_tema: idTema }
        });
    }

    /**
     * Crear objeto de aprendizaje con archivo subido a Cloudinary
     */
    async createWithFile(
        objetoData: Partial<ObjetosAprendizaje>,
        file: Express.Multer.File
    ): Promise<ObjetosAprendizaje> {
        const uploadResult: CloudinaryUploadResult = await this.cloudinaryService.uploadFile(
            file,
            'objetos-aprendizaje'
        );

        const nuevoObjeto = this.objetosAprendizajeRepository.create({
            ...objetoData,
            contenido: uploadResult.url,
            cloudinary_public_id: uploadResult.public_id
        });

        return await this.objetosAprendizajeRepository.save(nuevoObjeto);
    }

    /**
     * Actualizar objeto de aprendizaje con nuevo archivo opcional.
     * Si se proporciona un nuevo archivo, elimina el anterior de Cloudinary.
     */
    async updateWithFile(
        id: number,
        objetoData: Partial<ObjetosAprendizaje>,
        file?: Express.Multer.File
    ): Promise<ObjetosAprendizaje> {
        const objetoExistente = await this.objetosAprendizajeRepository.findOne({
            where: { id }
        });

        if (!objetoExistente) {
            throw new NotFoundException('Objeto de aprendizaje no encontrado');
        }

        if (file) {
            // Eliminar archivo antiguo de Cloudinary si existe
            const cloudinaryInfoAntigua = this.resolverCloudinaryInfo(objetoExistente);
            if (cloudinaryInfoAntigua) {
                const { publicId, resourceType } = cloudinaryInfoAntigua;
                try {
                    await this.cloudinaryService.deleteFile(publicId, resourceType);
                    console.log(`Archivo antiguo eliminado de Cloudinary: ${publicId} (${resourceType})`);
                } catch (error) {
                    console.error('Error al eliminar archivo antiguo de Cloudinary:', error.message);
                    // No abortar: continuar con la subida del nuevo archivo
                }
            }

            // Subir nuevo archivo
            const uploadResult: CloudinaryUploadResult = await this.cloudinaryService.uploadFile(
                file,
                'objetos-aprendizaje'
            );

            objetoData.contenido = uploadResult.url;
            objetoData.cloudinary_public_id = uploadResult.public_id;

            console.log(`Nuevo archivo subido a Cloudinary: ${uploadResult.public_id}`);
        }

        await this.objetosAprendizajeRepository.update(id, objetoData);

        return await this.objetosAprendizajeRepository.findOne({ where: { id } });
    }

    /**
     * Eliminar objeto de aprendizaje.
     * Si tiene archivo en Cloudinary, lo elimina primero con el resource_type correcto.
     * Si no tiene archivo (URL externa, texto, etc.), solo elimina el registro de la BD.
     */
    async deleteWithFile(id: number): Promise<{ message: string; fileDeleted: boolean }> {
        const objeto = await this.objetosAprendizajeRepository.findOne({ where: { id } });

        if (!objeto) {
            throw new NotFoundException('Objeto de aprendizaje no encontrado');
        }

        let fileDeleted = false;

        const cloudinaryInfo = this.resolverCloudinaryInfo(objeto);
        if (cloudinaryInfo) {
            const { publicId, resourceType } = cloudinaryInfo;
            try {
                await this.cloudinaryService.deleteFile(publicId, resourceType);
                fileDeleted = true;
                console.log(`Archivo eliminado de Cloudinary: ${publicId} (${resourceType})`);
            } catch (error) {
                console.error(`Error al eliminar archivo de Cloudinary (${publicId}):`, error.message);
                // No abortar: igual eliminamos el registro de la BD
            }
        } else {
            console.log(`Objeto ${id} no tiene archivo en Cloudinary, solo se elimina el registro.`);
        }

        // Eliminar físicamente el registro (no softDelete)
        await this.objetosAprendizajeRepository.delete(id);

        return {
            message: 'Objeto de aprendizaje eliminado exitosamente',
            fileDeleted,
        };
    }

    /**
     * Generar URL de descarga para un objeto almacenado en Cloudinary
     */
    async getDownloadUrl(id: number): Promise<{ downloadUrl: string; nombre: string }> {
        const objeto = await this.objetosAprendizajeRepository.findOne({ where: { id } });

        if (!objeto) {
            throw new NotFoundException('Objeto de aprendizaje no encontrado');
        }

        const cloudinaryInfo = this.resolverCloudinaryInfo(objeto);
        if (!cloudinaryInfo) {
            throw new NotFoundException('El objeto no tiene un archivo almacenado en Cloudinary');
        }

        const downloadUrl = this.cloudinaryService.getDownloadUrl(
            cloudinaryInfo.publicId,
            cloudinaryInfo.resourceType
        );

        return {
            downloadUrl,
            nombre: objeto.nombre
        };
    }

    /**
     * Resuelve el public_id Y resource_type de Cloudinary para un objeto.
     * Prioriza cloudinary_public_id guardado en BD.
     * Como fallback, intenta extraerlo de la URL si es una URL de Cloudinary.
     * Retorna null si el objeto no tiene archivo en Cloudinary.
     */
    private resolverCloudinaryInfo(objeto: ObjetosAprendizaje): {
        publicId: string;
        resourceType: 'image' | 'video' | 'raw';
    } | null {
        let publicId: string | null = null;

        // Caso 1: public_id guardado explícitamente en BD (el más confiable)
        if (objeto.cloudinary_public_id) {
            publicId = objeto.cloudinary_public_id;
        }
        // Caso 2: URL de Cloudinary sin public_id guardado — extraer como fallback
        else if (objeto.contenido?.includes('cloudinary.com')) {
            try {
                publicId = this.cloudinaryService.extractPublicId(objeto.contenido);
            } catch (error) {
                console.error(`No se pudo extraer public_id de la URL: ${objeto.contenido}`, error.message);
                return null;
            }
        }
        // Caso 3: No tiene archivo en Cloudinary (URL externa, texto, etc.)
        else {
            return null;
        }

        const resourceType = this.inferResourceType(objeto.contenido || '');
        return { publicId, resourceType };
    }

    /**
     * Infiere el resource_type a partir de la URL de Cloudinary.
     * Cloudinary siempre incluye /image/upload/, /video/upload/ o /raw/upload/ en la URL.
     */
    private inferResourceType(url: string): 'image' | 'video' | 'raw' {
        if (url.includes('/video/upload/')) return 'video';
        if (url.includes('/image/upload/')) return 'image';
        return 'raw'; // PDFs, documentos, audio
    }
}