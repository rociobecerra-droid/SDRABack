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
exports.GruposController = void 0;
const common_1 = require("@nestjs/common");
const grupos_service_1 = require("./grupos.service");
const grupos_entity_1 = require("./grupos.entity");
const generic_controller_1 = require("../generic/generic.controller");
let GruposController = class GruposController extends generic_controller_1.GenericController {
    constructor(gruposService) {
        super(gruposService);
        this.gruposService = gruposService;
    }
    async findAll() {
        return this.gruposService.find();
    }
    async create(entity) {
        return this.gruposService.create(entity);
    }
    async findByGrupoId(idGrupos) {
        const ids = idGrupos.split(',').map(Number);
        return this.gruposService.findByGrupoIds(ids);
    }
    async findByNumGrupo(numGrupo) {
        return this.gruposService.findByNumGrupo(numGrupo);
    }
    async findConteoByNumGrupo(numGrupo) {
        return this.gruposService.obtenerConteoAlumnosPorEstrategia(numGrupo);
    }
    async obtenerNumerosGrupo() {
        return this.gruposService.obtenerNumerosGrupo();
    }
    async findGrupo(grupo) {
        return this.gruposService.find(grupo);
    }
    async asignarEstrategias(grupoId, estrategias) {
        return this.gruposService.asignarEstrategias(grupoId, estrategias);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [grupos_entity_1.Grupos]),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('id_grupo/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "findByGrupoId", null);
__decorate([
    (0, common_1.Get)('grupo/:numGrupo'),
    __param(0, (0, common_1.Param)('numGrupo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "findByNumGrupo", null);
__decorate([
    (0, common_1.Get)('grupo/conteo/:numGrupo'),
    __param(0, (0, common_1.Param)('numGrupo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "findConteoByNumGrupo", null);
__decorate([
    (0, common_1.Get)('numeros'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "obtenerNumerosGrupo", null);
__decorate([
    (0, common_1.Post)('grupo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "findGrupo", null);
__decorate([
    (0, common_1.Post)('asignar-estrategias/:grupoId'),
    __param(0, (0, common_1.Param)('grupoId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], GruposController.prototype, "asignarEstrategias", null);
GruposController = __decorate([
    (0, common_1.Controller)('grupos'),
    __metadata("design:paramtypes", [grupos_service_1.GruposService])
], GruposController);
exports.GruposController = GruposController;
//# sourceMappingURL=grupos.controller.js.map