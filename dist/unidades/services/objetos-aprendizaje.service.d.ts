/// <reference types="multer" />
import { Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { ObjetosAprendizaje } from '../entities/objetos_aprendizaje.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
export declare class ObjetosAprendizajeService extends GenericService<ObjetosAprendizaje> {
    private readonly objetosAprendizajeRepository;
    private readonly cloudinaryService;
    constructor(objetosAprendizajeRepository: Repository<ObjetosAprendizaje>, cloudinaryService: CloudinaryService);
    findByTemaId(idTema: number): Promise<ObjetosAprendizaje[]>;
    countByTemaId(idTema: number): Promise<number>;
    createWithFile(objetoData: Partial<ObjetosAprendizaje>, file: Express.Multer.File): Promise<ObjetosAprendizaje>;
    updateWithFile(id: number, objetoData: Partial<ObjetosAprendizaje>, file?: Express.Multer.File): Promise<ObjetosAprendizaje>;
    deleteWithFile(id: number): Promise<{
        message: string;
        fileDeleted: boolean;
    }>;
    getDownloadUrl(id: number): Promise<{
        downloadUrl: string;
        nombre: string;
    }>;
    private resolverCloudinaryInfo;
    private inferResourceType;
}
