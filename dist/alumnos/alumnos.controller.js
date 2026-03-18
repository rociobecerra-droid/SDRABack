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
exports.AlumnosController = void 0;
const common_1 = require("@nestjs/common");
const alumnos_service_1 = require("./alumnos.service");
const alumnos_entity_1 = require("./alumnos.entity");
const generic_controller_1 = require("../generic/generic.controller");
const create_alumno_dto_1 = require("./dtos/create-alumno.dto");
let AlumnosController = class AlumnosController extends generic_controller_1.GenericController {
    constructor(alumnosService) {
        super(alumnosService);
        this.alumnosService = alumnosService;
    }
    async findAll() {
        return this.alumnosService.find();
    }
    async create(entity) {
        return this.alumnosService.create(entity);
    }
    async login(body) {
        const { nro_cuenta, password } = body;
        const alumno = await this.alumnosService.obtenerAlumno(nro_cuenta, password);
        if (!alumno || alumno.contraseña !== password) {
            return { error: 'Credenciales inválidas' };
        }
        return alumno;
    }
    async buscarAlumnos(search, grupo, page, limit) {
        return this.alumnosService.buscarAlumnos(search, grupo ? Number(grupo) : undefined, page ? Number(page) : 1, limit ? Number(limit) : 10);
    }
    async findByNroCuenta(nroCuenta) {
        return this.alumnosService.findByNroCuenta(nroCuenta);
    }
    async findByGrupo(grupo) {
        return this.alumnosService.findByGrupo(grupo);
    }
    async verificarCuestionario(nroCuenta) {
        const tieneAsignado = await this.alumnosService.verificarCuestionarioAsignado(nroCuenta);
        return {
            nroCuenta,
            tieneAsignado
        };
    }
    async createAlumno(createAlumnoDto) {
        return this.alumnosService.crearAlumno(createAlumnoDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [alumnos_entity_1.Alumnos]),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('buscar'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('grupo')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "buscarAlumnos", null);
__decorate([
    (0, common_1.Get)('nro-cuenta/:nroCuenta'),
    __param(0, (0, common_1.Param)('nroCuenta', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "findByNroCuenta", null);
__decorate([
    (0, common_1.Get)('grupo/:grupo'),
    __param(0, (0, common_1.Param)('grupo', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "findByGrupo", null);
__decorate([
    (0, common_1.Get)(':nroCuenta/verificar-cuestionario'),
    __param(0, (0, common_1.Param)('nroCuenta', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "verificarCuestionario", null);
__decorate([
    (0, common_1.Post)('create-alumno'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_alumno_dto_1.CreateAlumnoDto]),
    __metadata("design:returntype", Promise)
], AlumnosController.prototype, "createAlumno", null);
AlumnosController = __decorate([
    (0, common_1.Controller)('alumnos'),
    __metadata("design:paramtypes", [alumnos_service_1.AlumnosService])
], AlumnosController);
exports.AlumnosController = AlumnosController;
//# sourceMappingURL=alumnos.controller.js.map