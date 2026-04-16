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
exports.UnidadesController = void 0;
const common_1 = require("@nestjs/common");
const generic_controller_1 = require("../../generic/generic.controller");
const unidades_entity_1 = require("../entities/unidades.entity");
const unidades_service_1 = require("../services/unidades.service");
const update_unidad_dto_1 = require("../dtos/update-unidad.dto");
let UnidadesController = class UnidadesController extends generic_controller_1.GenericController {
    constructor(unidadesService) {
        super(unidadesService);
        this.unidadesService = unidadesService;
    }
    async findAll() {
        return this.unidadesService.find();
    }
    async create(entity) {
        return this.unidadesService.create(entity);
    }
    async updateUnit(id, updateUnidadDto) {
        return this.unidadesService.update(id, updateUnidadDto);
    }
    async findByMateria(idMateria) {
        return this.unidadesService.findByMateriaId(idMateria);
    }
    async findWithTemas(id) {
        return this.unidadesService.findWithTemas(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unidades_entity_1.Unidades]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_unidad_dto_1.UpdateUnidadDto]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "updateUnit", null);
__decorate([
    (0, common_1.Get)('materia/:idMateria'),
    __param(0, (0, common_1.Param)('idMateria')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "findByMateria", null);
__decorate([
    (0, common_1.Get)(':id/with-temas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UnidadesController.prototype, "findWithTemas", null);
UnidadesController = __decorate([
    (0, common_1.Controller)('unidades'),
    __metadata("design:paramtypes", [unidades_service_1.UnidadesService])
], UnidadesController);
exports.UnidadesController = UnidadesController;
//# sourceMappingURL=unidades.controller.js.map