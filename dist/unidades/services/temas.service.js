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
exports.TemasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_service_1 = require("../../generic/generic.service");
const temas_entity_1 = require("../entities/temas.entity");
let TemasService = class TemasService extends generic_service_1.GenericService {
    constructor(temasRepository) {
        super(temasRepository);
        this.temasRepository = temasRepository;
    }
    async findByUnidadId(idUnidad) {
        return this.temasRepository.find({
            where: { id_unidad: idUnidad },
            relations: ['objetosAprendizaje'],
            order: { numero_tema: 'ASC' }
        });
    }
    async findWithObjetos(id) {
        return this.temasRepository.findOne({
            where: { id },
            relations: ['objetosAprendizaje', 'unidad']
        });
    }
    async updateTema(id, updateTemaDto) {
        const tema = await this.temasRepository.findOne({ where: { id } });
        if (!tema) {
            throw new Error(`Tema with ID ${id} not found`);
        }
        this.temasRepository.merge(tema, updateTemaDto);
        console.log('Merged Tema:', tema);
        return this.temasRepository.save(tema);
    }
};
TemasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(temas_entity_1.Temas)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TemasService);
exports.TemasService = TemasService;
//# sourceMappingURL=temas.service.js.map