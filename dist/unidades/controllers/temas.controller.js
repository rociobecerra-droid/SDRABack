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
exports.TemasController = void 0;
const common_1 = require("@nestjs/common");
const generic_controller_1 = require("../../generic/generic.controller");
const temas_entity_1 = require("../entities/temas.entity");
const temas_service_1 = require("../services/temas.service");
const update_tema_dto_1 = require("../dtos/update-tema.dto");
let TemasController = class TemasController extends generic_controller_1.GenericController {
    constructor(temasService) {
        super(temasService);
        this.temasService = temasService;
    }
    async findAll() {
        return this.temasService.find();
    }
    async create(entity) {
        return this.temasService.create(entity);
    }
    async updateTopic(id, updateTemaDto) {
        console.log('Updating Tema with ID:', id, 'Data:', updateTemaDto);
        return this.temasService.updateTema(id, updateTemaDto);
    }
    async findByUnidad(idUnidad) {
        return this.temasService.findByUnidadId(idUnidad);
    }
    async findWithObjetos(id) {
        return this.temasService.findWithObjetos(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [temas_entity_1.Temas]),
    __metadata("design:returntype", Promise)
], TemasController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tema_dto_1.UpdateTemaDto]),
    __metadata("design:returntype", Promise)
], TemasController.prototype, "updateTopic", null);
__decorate([
    (0, common_1.Get)('unidad/:idUnidad'),
    __param(0, (0, common_1.Param)('idUnidad')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TemasController.prototype, "findByUnidad", null);
__decorate([
    (0, common_1.Get)(':id/with-objetos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TemasController.prototype, "findWithObjetos", null);
TemasController = __decorate([
    (0, common_1.Controller)('temas'),
    __metadata("design:paramtypes", [temas_service_1.TemasService])
], TemasController);
exports.TemasController = TemasController;
//# sourceMappingURL=temas.controller.js.map