"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlumnosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alumnos_entity_1 = require("./alumnos.entity");
const generic_service_1 = require("../generic/generic.service");
const alumnos_cuestionarios_service_1 = require("../alumnos_cuestionarios/alumnos_cuestionarios.service");
const CUESTIONARIO_DEFAULT_ID = 1;
let AlumnosService = class AlumnosService extends generic_service_1.GenericService {
    constructor(alumnosRepository, alumnosCuestionariosService) {
        super(alumnosRepository);
        this.alumnosRepository = alumnosRepository;
        this.alumnosCuestionariosService = alumnosCuestionariosService;
    }
    async crearAlumno(createAlumnoDto) {
        const alumnoExistente = await this.alumnosRepository.findOne({
            where: { nro_cuenta: createAlumnoDto.nro_cuenta },
        });
        if (alumnoExistente) {
            throw new common_1.BadRequestException(`Ya existe un alumno con el número de cuenta ${createAlumnoDto.nro_cuenta}`);
        }
        const nuevoAlumno = this.alumnosRepository.create(createAlumnoDto);
        const alumnoGuardado = await this.alumnosRepository.save(nuevoAlumno);
        try {
            await this.alumnosCuestionariosService.asignarCuestionario(alumnoGuardado.nro_cuenta, CUESTIONARIO_DEFAULT_ID);
            console.log(`Cuestionario ${CUESTIONARIO_DEFAULT_ID} asignado automáticamente al alumno ${alumnoGuardado.nro_cuenta}`);
        }
        catch (error) {
            console.error('Error al asignar cuestionario:', error.message);
        }
        return alumnoGuardado;
    }
    async obtenerAlumno(nroCuenta, password) {
        if (nroCuenta === undefined) {
            return null;
        }
        const alumno = await this.alumnosRepository.findOne({
            where: { nro_cuenta: nroCuenta },
        });
        if (alumno && alumno.contraseña === password) {
            return alumno;
        }
        return null;
    }
    async findByNroCuenta(nroCuenta) {
        const alumno = await this.alumnosRepository.findOne({
            where: { nro_cuenta: nroCuenta, deleted: null },
            relations: [
                'grupoRelacion',
                'alumnosCuestionarios',
                'alumnosCuestionarios.cuestionario',
            ],
        });
        if (!alumno) {
            throw new common_1.NotFoundException(`Alumno con número de cuenta ${nroCuenta} no encontrado`);
        }
        return alumno;
    }
    async findByGrupo(grupo) {
        return this.alumnosRepository.find({
            where: { grupo, deleted: null },
            relations: ['grupoRelacion'],
        });
    }
    async cambiarContrasena(nro_cuenta, currentPassword, newPassword) {
        const alumno = await this.alumnosRepository.findOne({
            where: { nro_cuenta, deleted: null },
        });
        if (!alumno) {
            throw new common_1.NotFoundException(`Alumno con número de cuenta ${nro_cuenta} no encontrado`);
        }
        if (alumno.contraseña !== currentPassword) {
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        }
        alumno.contraseña = newPassword;
        return this.alumnosRepository.save(alumno);
    }
    async verificarCuestionarioAsignado(nroCuenta) {
        try {
            const asignaciones = await this.alumnosCuestionariosService.obtenerCuestionariosAlumno(nroCuenta);
            return asignaciones.some((a) => a.id_cuestionario === CUESTIONARIO_DEFAULT_ID);
        }
        catch (error) {
            return false;
        }
    }
    async buscarAlumnos(search, grupo, page = 1, limit = 10) {
        const query = this.alumnosRepository
            .createQueryBuilder('alumno')
            .where('alumno.deleted IS NULL');
        if (search) {
            query.andWhere('(CONCAT(alumno.nombre, " ", alumno.apellido_1, " ", alumno.apellido_2) LIKE :search OR alumno.nro_cuenta LIKE :search)', { search: `%${search}%` });
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
};
AlumnosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alumnos_entity_1.Alumnos)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        alumnos_cuestionarios_service_1.AlumnosCuestionariosService])
], AlumnosService);
exports.AlumnosService = AlumnosService;
//# sourceMappingURL=alumnos.service.js.map