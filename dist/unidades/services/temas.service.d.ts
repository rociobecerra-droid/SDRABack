import { Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { Temas } from '../entities/temas.entity';
export declare class TemasService extends GenericService<Temas> {
    private readonly temasRepository;
    constructor(temasRepository: Repository<Temas>);
    findByUnidadId(idUnidad: number): Promise<Temas[]>;
    findWithObjetos(id: number): Promise<Temas>;
    updateTema(id: number, updateTemaDto: any): Promise<Temas>;
}
