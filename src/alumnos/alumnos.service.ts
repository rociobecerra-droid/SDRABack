import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumnos } from './alumnos.entity';
import { GenericService } from 'src/generic/generic.service';
import { AlumnosCuestionariosService } from 'src/alumnos_cuestionarios/alumnos_cuestionarios.service';
import { CreateAlumnoDto } from './dtos/create-alumno.dto';

const CUESTIONARIO_DEFAULT_ID = 1; // ID del cuestionario a asignar automáticamente
@Injectable()
export class AlumnosService extends GenericService<Alumnos> {
  constructor(
    @InjectRepository(Alumnos) 
    private readonly alumnosRepository: Repository<Alumnos>,
    private readonly alumnosCuestionariosService: AlumnosCuestionariosService,
  ) {
    super(alumnosRepository);
  }

  /**
   * Crear un nuevo alumno con asignación automática de cuestionario
   * @param createAlumnoDto Datos del alumno a crear
   * @returns El alumno creado con toda su información
   */
  async crearAlumno(createAlumnoDto: CreateAlumnoDto): Promise<Alumnos> {
    // 1. Verificar si ya existe un alumno con ese número de cuenta
    const alumnoExistente = await this.alumnosRepository.findOne({
      where: { nro_cuenta: createAlumnoDto.nro_cuenta }
    });

    if (alumnoExistente) {
      throw new BadRequestException(
        `Ya existe un alumno con el número de cuenta ${createAlumnoDto.nro_cuenta}`
      );
    }

    // 2. Crear y guardar el alumno usando repository.save()
    const nuevoAlumno = this.alumnosRepository.create(createAlumnoDto);
    const alumnoGuardado = await this.alumnosRepository.save(nuevoAlumno);

    // 3. Asignar cuestionario automáticamente
    try {
      await this.alumnosCuestionariosService.asignarCuestionario(
        alumnoGuardado.nro_cuenta,
        CUESTIONARIO_DEFAULT_ID
      );
      console.log(
        `Cuestionario ${CUESTIONARIO_DEFAULT_ID} asignado automáticamente al alumno ${alumnoGuardado.nro_cuenta}`
      );
    } catch (error) {
      console.error('Error al asignar cuestionario:', error.message);
      // No fallar la creación del alumno si falla la asignación
      // El cuestionario se puede asignar manualmente después
    }

    return alumnoGuardado;
  }

  async obtenerAlumno(nroCuenta: number, password: string): Promise<Alumnos> {
    if(nroCuenta===undefined){
      return null
    }

    const alumno = await this.alumnosRepository.findOne({where: { nro_cuenta: nroCuenta }});

    if (alumno && alumno.contraseña === password) {
      return alumno;
    }

    return null;
  }

  /**
   * Obtener un alumno por número de cuenta con sus cuestionarios
   * @param nroCuenta Número de cuenta del alumno
   * @returns El alumno con sus relaciones
   */
  async findByNroCuenta(nroCuenta: number): Promise<Alumnos> {
    const alumno = await this.alumnosRepository.findOne({
      where: { nro_cuenta: nroCuenta, deleted: null },
      relations: ['grupoRelacion', 'alumnosCuestionarios', 'alumnosCuestionarios.cuestionario']
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con número de cuenta ${nroCuenta} no encontrado`);
    }

    return alumno;
  }

  /**
   * Obtener alumnos por grupo
   * @param grupo Número del grupo
   * @returns Lista de alumnos del grupo
   */
  async findByGrupo(grupo: number): Promise<Alumnos[]> {
    return this.alumnosRepository.find({
      where: { grupo, deleted: null },
      relations: ['grupoRelacion']
    });
  }

  /**
   * Verificar si un alumno tiene el cuestionario por defecto asignado
   * @param nroCuenta Número de cuenta del alumno
   * @returns true si tiene el cuestionario asignado
   */
  async verificarCuestionarioAsignado(nroCuenta: number): Promise<boolean> {
    try {
      const asignaciones = await this.alumnosCuestionariosService.obtenerCuestionariosAlumno(nroCuenta);
      return asignaciones.some(a => a.id_cuestionario === CUESTIONARIO_DEFAULT_ID);
    } catch (error) {
      return false;
    }
  }

  async buscarAlumnos(
  search?: string,
  grupo?: number,
  page: number = 1,
  limit: number = 10
): Promise<{ data: Alumnos[]; total: number; page: number; totalPages: number }> {
  const query = this.alumnosRepository.createQueryBuilder('alumno')
    .where('alumno.deleted IS NULL');

  if (search) {
    query.andWhere(
      '(CONCAT(alumno.nombre, " ", alumno.apellido_1, " ", alumno.apellido_2) LIKE :search OR alumno.nro_cuenta LIKE :search)',
      { search: `%${search}%` }
    );
  }

  if (grupo) {
    query.andWhere('alumno.grupo = :grupo', { grupo });
  }

  const total = await query.getCount();

  const data = await query
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy('alumno.apellido_1', 'ASC')
    .getMany();

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
}
