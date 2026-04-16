import { GenericController } from 'src/generic/generic.controller';
import { Unidades } from '../entities/unidades.entity';
import { UnidadesService } from '../services/unidades.service';
import { UpdateUnidadDto } from '../dtos/update-unidad.dto';
export declare class UnidadesController extends GenericController<Unidades, UnidadesService> {
    private readonly unidadesService;
    constructor(unidadesService: UnidadesService);
    findAll(): Promise<Unidades[]>;
    create(entity: Unidades): Promise<import("typeorm").InsertResult>;
    updateUnit(id: number, updateUnidadDto: UpdateUnidadDto): Promise<Unidades>;
    findByMateria(idMateria: number): Promise<Unidades[]>;
    findWithTemas(id: number): Promise<Unidades>;
}
