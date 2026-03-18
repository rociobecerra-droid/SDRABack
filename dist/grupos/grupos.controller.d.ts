import { GruposService } from './grupos.service';
import { Grupos } from './grupos.entity';
import { GenericController } from 'src/generic/generic.controller';
export declare class GruposController extends GenericController<Grupos, GruposService> {
    private readonly gruposService;
    constructor(gruposService: GruposService);
    findAll(): Promise<Grupos[]>;
    create(entity: Grupos): Promise<import("typeorm").InsertResult>;
    findByGrupoId(idGrupos: string): Promise<Grupos[]>;
    findByNumGrupo(numGrupo: number): Promise<Grupos>;
    findConteoByNumGrupo(numGrupo: number): Promise<{
        [key: string]: number;
    }>;
    obtenerNumerosGrupo(): Promise<number[]>;
    findGrupo(grupo: any): Promise<Grupos[]>;
    asignarEstrategias(grupoId: number, estrategias: number[]): Promise<Grupos>;
}
