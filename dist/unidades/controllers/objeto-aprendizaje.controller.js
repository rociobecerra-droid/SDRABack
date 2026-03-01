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
exports.ObjetosAprendizajeController = void 0;
const common_1 = require("@nestjs/common");
const generic_controller_1 = require("../../generic/generic.controller");
const objetos_aprendizaje_entity_1 = require("../entities/objetos_aprendizaje.entity");
const objetos_aprendizaje_service_1 = require("../services/objetos-aprendizaje.service");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
const platform_express_1 = require("@nestjs/platform-express");
let ObjetosAprendizajeController = class ObjetosAprendizajeController extends generic_controller_1.GenericController {
    constructor(objetosAprendizajeService, cloudinaryService) {
        super(objetosAprendizajeService);
        this.objetosAprendizajeService = objetosAprendizajeService;
        this.cloudinaryService = cloudinaryService;
    }
    async findAll() {
        return this.objetosAprendizajeService.find();
    }
    async create(entity) {
        return this.objetosAprendizajeService.create(entity);
    }
    async createWithFile(file, body) {
        if (!file) {
            throw new common_1.BadRequestException('Archivo no proporcionado');
        }
        try {
            return await this.objetosAprendizajeService.createWithFile(body, file);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error al subir el archivo: ${error.message}`);
        }
    }
    async findByTema(idTema) {
        return this.objetosAprendizajeService.findByTemaId(idTema);
    }
    async countByTema(idTema) {
        const count = await this.objetosAprendizajeService.countByTemaId(idTema);
        return { count };
    }
    async updateWithFile(id, file, body) {
        try {
            return await this.objetosAprendizajeService.updateWithFile(id, body, file);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error al actualizar el archivo: ${error.message}`);
        }
    }
    async getDownloadUrl(id) {
        try {
            return await this.objetosAprendizajeService.getDownloadUrl(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteWithFile(id) {
        try {
            return await this.objetosAprendizajeService.deleteWithFile(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [objetos_aprendizaje_entity_1.ObjetosAprendizaje]),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "createWithFile", null);
__decorate([
    (0, common_1.Get)('tema/:idTema'),
    __param(0, (0, common_1.Param)('idTema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "findByTema", null);
__decorate([
    (0, common_1.Get)('tema/:idTema/count'),
    __param(0, (0, common_1.Param)('idTema')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "countByTema", null);
__decorate([
    (0, common_1.Put)('upload/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "updateWithFile", null);
__decorate([
    (0, common_1.Get)(':id/download-url'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "getDownloadUrl", null);
__decorate([
    (0, common_1.Delete)(':id/full'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ObjetosAprendizajeController.prototype, "deleteWithFile", null);
ObjetosAprendizajeController = __decorate([
    (0, common_1.Controller)('objetos-aprendizaje'),
    __metadata("design:paramtypes", [objetos_aprendizaje_service_1.ObjetosAprendizajeService,
        cloudinary_service_1.CloudinaryService])
], ObjetosAprendizajeController);
exports.ObjetosAprendizajeController = ObjetosAprendizajeController;
//# sourceMappingURL=objeto-aprendizaje.controller.js.map