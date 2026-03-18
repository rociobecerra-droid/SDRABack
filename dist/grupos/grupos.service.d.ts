import { Repository } from 'typeorm';
import { Grupos } from './grupos.entity';
import { GenericService } from 'src/generic/generic.service';
import { EstrategiaEnsenanzaService } from 'src/estrategias_enseñanza/estrategias_enseñanza.service';
import { PerfilFinalInventarioDeFelder } from 'src/perfil_final_inventario_de_felder/perfil_final_inventario_de_felder.entity';
export declare class GruposService extends GenericService<Grupos> {
    private readonly gruposRepository;
    private readonly perfilFinalRepository;
    private readonly estrategiasEnsenanzaService;
    constructor(gruposRepository: Repository<Grupos>, perfilFinalRepository: Repository<PerfilFinalInventarioDeFelder>, estrategiasEnsenanzaService: EstrategiaEnsenanzaService);
    findByNumGrupo(numGrupo: number): Promise<Grupos>;
    findByGrupoIds(ids: number[]): Promise<Grupos[]>;
    obtenerNumerosGrupo(): Promise<number[]>;
    asignarEstrategias(grupoId: number, estrategiasIds: number[]): Promise<Grupos>;
    obtenerConteoAlumnosPorEstrategia(numGrupo: number, topResultados?: number): Promise<{
        [key: string]: number;
    }>;
}
