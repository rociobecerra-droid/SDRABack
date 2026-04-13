import {
  Controller,
  Body,
  Get,
  Post,
  ParseIntPipe,
  Param,
  Query,
} from '@nestjs/common';
import { AlumnosService } from './alumnos.service';
import { Alumnos } from './alumnos.entity';
import { GenericController } from 'src/generic/generic.controller';
import { CreateAlumnoDto } from './dtos/create-alumno.dto';
import { UpdateAlumnoDto } from './dtos/update-alumno.dto';
import { LoginAlumnoDto } from './dtos/login.dto';
@Controller('alumnos')
export class AlumnosController extends GenericController<
  Alumnos,
  AlumnosService
> {
  constructor(private readonly alumnosService: AlumnosService) {
    super(alumnosService);
  }

  @Get()
  async findAll(): Promise<Alumnos[]> {
    return this.alumnosService.find();
  }

  @Post()
  async create(@Body() entity: Alumnos) {
    return this.alumnosService.create(entity);
  }

  @Post('login')
  async login(@Body() body: { nro_cuenta: number; password: string }) {
    const { nro_cuenta, password } = body;
    // Buscar el alumno basado en el nroCuenta
    const alumno = await this.alumnosService.obtenerAlumno(
      nro_cuenta,
      password,
    );

    if (!alumno || alumno.contraseña !== password) {
      // El inicio de sesión falló
      // Devolver un error o un objeto con el mensaje de error correspondiente
      return { error: 'Credenciales inválidas' };
    }

    // Inicio de sesión exitoso
    return alumno;
  }

  @Get('buscar')
  async buscarAlumnos(
    @Query('search') search?: string,
    @Query('grupo') grupo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.alumnosService.buscarAlumnos(
      search,
      grupo ? Number(grupo) : undefined,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  /**
   * GET /alumnos/nro-cuenta/:nroCuenta
   * Obtener alumno por número de cuenta con sus cuestionarios
   */
  @Get('nro-cuenta/:nroCuenta')
  async findByNroCuenta(@Param('nroCuenta', ParseIntPipe) nroCuenta: number) {
    return this.alumnosService.findByNroCuenta(nroCuenta);
  }

  /**
   * GET /alumnos/grupo/:grupo
   * Obtener alumnos de un grupo
   */
  @Get('grupo/:grupo')
  async findByGrupo(@Param('grupo', ParseIntPipe) grupo: number) {
    return this.alumnosService.findByGrupo(grupo);
  }

  /**
   * GET /alumnos/:nroCuenta/verificar-cuestionario
   * Verificar si un alumno tiene el cuestionario asignado
   */
  @Get(':nroCuenta/verificar-cuestionario')
  async verificarCuestionario(
    @Param('nroCuenta', ParseIntPipe) nroCuenta: number,
  ) {
    const tieneAsignado =
      await this.alumnosService.verificarCuestionarioAsignado(nroCuenta);
    return {
      nroCuenta,
      tieneAsignado,
    };
  }

  @Post('create-alumno')
  async createAlumno(
    @Body() createAlumnoDto: CreateAlumnoDto,
  ): Promise<Alumnos> {
    return this.alumnosService.crearAlumno(createAlumnoDto);
  }

  @Post('cambiar-contrasena')
  async cambiarContrasena(
    @Body()
    body: {
      nro_cuenta: number;
      currentPassword: string;
      newPassword: string;
    },
  ): Promise<Alumnos> {
    const { nro_cuenta, currentPassword, newPassword } = body;
    return this.alumnosService.cambiarContrasena(
      nro_cuenta,
      currentPassword,
      newPassword,
    );
  }
}
