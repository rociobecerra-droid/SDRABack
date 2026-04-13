import { Repository } from 'typeorm';
import { Alumnos } from './alumnos.entity';
import { GenericService } from 'src/generic/generic.service';
import { AlumnosCuestionariosService } from 'src/alumnos_cuestionarios/alumnos_cuestionarios.service';
import { CreateAlumnoDto } from './dtos/create-alumno.dto';
export declare class AlumnosService extends GenericService<Alumnos> {
    private readonly alumnosRepository;
    private readonly alumnosCuestionariosService;
    constructor(alumnosRepository: Repository<Alumnos>, alumnosCuestionariosService: AlumnosCuestionariosService);
    crearAlumno(createAlumnoDto: CreateAlumnoDto): Promise<Alumnos>;
    obtenerAlumno(nroCuenta: number, password: string): Promise<Alumnos>;
    findByNroCuenta(nroCuenta: number): Promise<Alumnos>;
    findByGrupo(grupo: number): Promise<Alumnos[]>;
    cambiarContrasena(nro_cuenta: number, currentPassword: string, newPassword: string): Promise<Alumnos>;
    verificarCuestionarioAsignado(nroCuenta: number): Promise<boolean>;
    buscarAlumnos(search?: string, grupo?: number, page?: number, limit?: number): Promise<{
        data: Alumnos[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
