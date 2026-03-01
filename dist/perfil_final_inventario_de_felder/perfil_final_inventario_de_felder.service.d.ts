import { PerfilFinalInventarioDeFelder } from './perfil_final_inventario_de_felder.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { Grupos } from 'src/grupos/grupos.entity';
import { ObjetosAprendizaje } from 'src/unidades/entities/objetos_aprendizaje.entity';
import { EstiloObjeto } from 'src/unidades/entities/estilo_objeto.entity';
import { ResultadoRecomendacionDto } from './dto/recomendacion.dto';
export declare class PerfilFinalInventarioDeFelderService extends GenericService<PerfilFinalInventarioDeFelder> {
    private readonly perfilFinalInventarioDeFelderRepository;
    private gruposRepository;
    private objetosAprendizajeRepository;
    private estiloObjetoRepository;
    constructor(perfilFinalInventarioDeFelderRepository: Repository<PerfilFinalInventarioDeFelder>, gruposRepository: Repository<Grupos>, objetosAprendizajeRepository: Repository<ObjetosAprendizaje>, estiloObjetoRepository: Repository<EstiloObjeto>);
    findByGrupoIds(ids: number[]): Promise<PerfilFinalInventarioDeFelder[]>;
    findByAlumnoIds(ids: number[]): Promise<PerfilFinalInventarioDeFelder[]>;
    findResultadoAlumno(numAlumno: number): Promise<PerfilFinalInventarioDeFelder[]>;
    find(options?: FindManyOptions<PerfilFinalInventarioDeFelder>): Promise<PerfilFinalInventarioDeFelder[]>;
    findModaEstrategiasByNumGrupo(numGrupo: number): Promise<string[]>;
    private extraerEstilos;
    recomendarObjetosParaTema(nroCuenta: number, idTema: number): Promise<ResultadoRecomendacionDto>;
}
