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
exports.ObjetosAprendizajeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_service_1 = require("../../generic/generic.service");
const objetos_aprendizaje_entity_1 = require("../entities/objetos_aprendizaje.entity");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
let ObjetosAprendizajeService = class ObjetosAprendizajeService extends generic_service_1.GenericService {
    constructor(objetosAprendizajeRepository, cloudinaryService) {
        super(objetosAprendizajeRepository);
        this.objetosAprendizajeRepository = objetosAprendizajeRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async findByTemaId(idTema) {
        return this.objetosAprendizajeRepository.find({
            where: { id_tema: idTema },
            relations: ['estiloObjeto']
        });
    }
    async countByTemaId(idTema) {
        return this.objetosAprendizajeRepository.count({
            where: { id_tema: idTema }
        });
    }
    async createWithFile(objetoData, file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file, 'objetos-aprendizaje');
        const nuevoObjeto = this.objetosAprendizajeRepository.create(Object.assign(Object.assign({}, objetoData), { contenido: uploadResult.url, cloudinary_public_id: uploadResult.public_id }));
        return await this.objetosAprendizajeRepository.save(nuevoObjeto);
    }
    async updateWithFile(id, objetoData, file) {
        const objetoExistente = await this.objetosAprendizajeRepository.findOne({
            where: { id }
        });
        if (!objetoExistente) {
            throw new common_1.NotFoundException('Objeto de aprendizaje no encontrado');
        }
        if (file) {
            const cloudinaryInfoAntigua = this.resolverCloudinaryInfo(objetoExistente);
            if (cloudinaryInfoAntigua) {
                const { publicId, resourceType } = cloudinaryInfoAntigua;
                try {
                    await this.cloudinaryService.deleteFile(publicId, resourceType);
                    console.log(`Archivo antiguo eliminado de Cloudinary: ${publicId} (${resourceType})`);
                }
                catch (error) {
                    console.error('Error al eliminar archivo antiguo de Cloudinary:', error.message);
                }
            }
            const uploadResult = await this.cloudinaryService.uploadFile(file, 'objetos-aprendizaje');
            objetoData.contenido = uploadResult.url;
            objetoData.cloudinary_public_id = uploadResult.public_id;
            console.log(`Nuevo archivo subido a Cloudinary: ${uploadResult.public_id}`);
        }
        await this.objetosAprendizajeRepository.update(id, objetoData);
        return await this.objetosAprendizajeRepository.findOne({ where: { id } });
    }
    async deleteWithFile(id) {
        const objeto = await this.objetosAprendizajeRepository.findOne({ where: { id } });
        if (!objeto) {
            throw new common_1.NotFoundException('Objeto de aprendizaje no encontrado');
        }
        let fileDeleted = false;
        const cloudinaryInfo = this.resolverCloudinaryInfo(objeto);
        if (cloudinaryInfo) {
            const { publicId, resourceType } = cloudinaryInfo;
            try {
                await this.cloudinaryService.deleteFile(publicId, resourceType);
                fileDeleted = true;
                console.log(`Archivo eliminado de Cloudinary: ${publicId} (${resourceType})`);
            }
            catch (error) {
                console.error(`Error al eliminar archivo de Cloudinary (${publicId}):`, error.message);
            }
        }
        else {
            console.log(`Objeto ${id} no tiene archivo en Cloudinary, solo se elimina el registro.`);
        }
        await this.objetosAprendizajeRepository.delete(id);
        return {
            message: 'Objeto de aprendizaje eliminado exitosamente',
            fileDeleted,
        };
    }
    async getDownloadUrl(id) {
        const objeto = await this.objetosAprendizajeRepository.findOne({ where: { id } });
        if (!objeto) {
            throw new common_1.NotFoundException('Objeto de aprendizaje no encontrado');
        }
        const cloudinaryInfo = this.resolverCloudinaryInfo(objeto);
        if (!cloudinaryInfo) {
            throw new common_1.NotFoundException('El objeto no tiene un archivo almacenado en Cloudinary');
        }
        const downloadUrl = this.cloudinaryService.getDownloadUrl(cloudinaryInfo.publicId, cloudinaryInfo.resourceType);
        return {
            downloadUrl,
            nombre: objeto.nombre
        };
    }
    resolverCloudinaryInfo(objeto) {
        var _a;
        let publicId = null;
        if (objeto.cloudinary_public_id) {
            publicId = objeto.cloudinary_public_id;
        }
        else if ((_a = objeto.contenido) === null || _a === void 0 ? void 0 : _a.includes('cloudinary.com')) {
            try {
                publicId = this.cloudinaryService.extractPublicId(objeto.contenido);
            }
            catch (error) {
                console.error(`No se pudo extraer public_id de la URL: ${objeto.contenido}`, error.message);
                return null;
            }
        }
        else {
            return null;
        }
        const resourceType = this.inferResourceType(objeto.contenido || '');
        return { publicId, resourceType };
    }
    inferResourceType(url) {
        if (url.includes('/video/upload/'))
            return 'video';
        if (url.includes('/image/upload/'))
            return 'image';
        return 'raw';
    }
};
ObjetosAprendizajeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(objetos_aprendizaje_entity_1.ObjetosAprendizaje)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], ObjetosAprendizajeService);
exports.ObjetosAprendizajeService = ObjetosAprendizajeService;
//# sourceMappingURL=objetos-aprendizaje.service.js.map