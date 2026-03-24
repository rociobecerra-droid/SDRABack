import { Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { EstiloObjeto } from '../entities/estilo_objeto.entity';
export declare class EstiloObjetoService extends GenericService<EstiloObjeto> {
    private readonly estiloObjetoRepository;
    constructor(estiloObjetoRepository: Repository<EstiloObjeto>);
    findByObjeto(objeto: string): Promise<EstiloObjeto>;
    findByEstilo(estilo: string): Promise<EstiloObjeto[]>;
    addEstiloToObjeto(id: number, nuevoEstilo: string): Promise<EstiloObjeto>;
    removeEstiloFromObjeto(id: number, estiloARemover: string): Promise<EstiloObjeto>;
    findAllStyles(): Promise<EstiloObjeto[]>;
}
