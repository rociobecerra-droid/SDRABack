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
exports.EstiloObjetoController = void 0;
const common_1 = require("@nestjs/common");
const generic_controller_1 = require("../../generic/generic.controller");
const estilo_objeto_entity_1 = require("../entities/estilo_objeto.entity");
const estilo_objeto_service_1 = require("../services/estilo-objeto.service");
let EstiloObjetoController = class EstiloObjetoController extends generic_controller_1.GenericController {
    constructor(estiloObjetoService) {
        super(estiloObjetoService);
        this.estiloObjetoService = estiloObjetoService;
    }
    async findAll() {
        return this.estiloObjetoService.findAllStyles();
    }
    async create(entity) {
        return this.estiloObjetoService.create(entity);
    }
    async findByObjeto(objeto) {
        const result = await this.estiloObjetoService.findByObjeto(objeto);
        if (!result) {
            throw new common_1.BadRequestException(`No se encontró un objeto con el nombre: ${objeto}`);
        }
        return result;
    }
    async findByEstilo(estilo) {
        return this.estiloObjetoService.findByEstilo(estilo);
    }
    async addEstilo(id, body) {
        if (!body.estilo) {
            throw new common_1.BadRequestException('El campo "estilo" es requerido');
        }
        return this.estiloObjetoService.addEstiloToObjeto(id, body.estilo);
    }
    async removeEstilo(id, body) {
        if (!body.estilo) {
            throw new common_1.BadRequestException('El campo "estilo" es requerido');
        }
        return this.estiloObjetoService.removeEstiloFromObjeto(id, body.estilo);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EstiloObjetoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estilo_objeto_entity_1.EstiloObjeto]),
    __metadata("design:returntype", Promise)
], EstiloObjetoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('objeto/:objeto'),
    __param(0, (0, common_1.Param)('objeto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstiloObjetoController.prototype, "findByObjeto", null);
__decorate([
    (0, common_1.Get)('estilo/:estilo'),
    __param(0, (0, common_1.Param)('estilo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstiloObjetoController.prototype, "findByEstilo", null);
__decorate([
    (0, common_1.Post)(':id/agregar-estilo'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EstiloObjetoController.prototype, "addEstilo", null);
__decorate([
    (0, common_1.Delete)(':id/remover-estilo'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EstiloObjetoController.prototype, "removeEstilo", null);
EstiloObjetoController = __decorate([
    (0, common_1.Controller)('estilo-objeto'),
    __metadata("design:paramtypes", [estilo_objeto_service_1.EstiloObjetoService])
], EstiloObjetoController);
exports.EstiloObjetoController = EstiloObjetoController;
//# sourceMappingURL=estilo-objeto.controller.js.map