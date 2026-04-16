import { GenericController } from 'src/generic/generic.controller';
import { Temas } from '../entities/temas.entity';
import { TemasService } from '../services/temas.service';
import { UpdateTemaDto } from '../dtos/update-tema.dto';
export declare class TemasController extends GenericController<Temas, TemasService> {
    private readonly temasService;
    constructor(temasService: TemasService);
    findAll(): Promise<Temas[]>;
    create(entity: Temas): Promise<import("typeorm").InsertResult>;
    updateTopic(id: number, updateTemaDto: UpdateTemaDto): Promise<Temas>;
    findByUnidad(idUnidad: number): Promise<Temas[]>;
    findWithObjetos(id: number): Promise<Temas>;
}
