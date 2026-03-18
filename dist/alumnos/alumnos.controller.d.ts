import { AlumnosService } from './alumnos.service';
import { Alumnos } from './alumnos.entity';
import { GenericController } from 'src/generic/generic.controller';
import { CreateAlumnoDto } from './dtos/create-alumno.dto';
export declare class AlumnosController extends GenericController<Alumnos, AlumnosService> {
    private readonly alumnosService;
    constructor(alumnosService: AlumnosService);
    findAll(): Promise<Alumnos[]>;
    create(entity: Alumnos): Promise<import("typeorm").InsertResult>;
    login(body: {
        nro_cuenta: number;
        password: string;
    }): Promise<Alumnos | {
        error: string;
    }>;
    buscarAlumnos(search?: string, grupo?: string, page?: string, limit?: string): Promise<{
        data: Alumnos[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findByNroCuenta(nroCuenta: number): Promise<Alumnos>;
    findByGrupo(grupo: number): Promise<Alumnos[]>;
    verificarCuestionario(nroCuenta: number): Promise<{
        nroCuenta: number;
        tieneAsignado: boolean;
    }>;
    createAlumno(createAlumnoDto: CreateAlumnoDto): Promise<Alumnos>;
}
