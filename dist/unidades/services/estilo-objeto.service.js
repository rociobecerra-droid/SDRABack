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
exports.EstiloObjetoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_service_1 = require("../../generic/generic.service");
const estilo_objeto_entity_1 = require("../entities/estilo_objeto.entity");
let EstiloObjetoService = class EstiloObjetoService extends generic_service_1.GenericService {
    constructor(estiloObjetoRepository) {
        super(estiloObjetoRepository);
        this.estiloObjetoRepository = estiloObjetoRepository;
    }
    async findByObjeto(objeto) {
        return this.estiloObjetoRepository.findOne({
            where: { objeto }
        });
    }
    async findByEstilo(estilo) {
        return this.estiloObjetoRepository
            .createQueryBuilder('estilo_objeto')
            .where('JSON_CONTAINS(estilo_objeto.estilos, :estilo)', {
            estilo: JSON.stringify(estilo)
        })
            .getMany();
    }
    async addEstiloToObjeto(id, nuevoEstilo) {
        const estiloObjeto = await this.estiloObjetoRepository.findOne({
            where: { id }
        });
        if (!estiloObjeto) {
            throw new Error(`EstiloObjeto con id ${id} no encontrado`);
        }
        if (!estiloObjeto.estilos.includes(nuevoEstilo)) {
            estiloObjeto.estilos.push(nuevoEstilo);
            return this.estiloObjetoRepository.save(estiloObjeto);
        }
        return estiloObjeto;
    }
    async removeEstiloFromObjeto(id, estiloARemover) {
        const estiloObjeto = await this.estiloObjetoRepository.findOne({
            where: { id }
        });
        if (!estiloObjeto) {
            throw new Error(`EstiloObjeto con id ${id} no encontrado`);
        }
        estiloObjeto.estilos = estiloObjeto.estilos.filter(estilo => estilo !== estiloARemover);
        return this.estiloObjetoRepository.save(estiloObjeto);
    }
    async findAllStyles() {
        return this.estiloObjetoRepository.find({
            order: { objeto: 'ASC' }
        });
    }
};
EstiloObjetoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estilo_objeto_entity_1.EstiloObjeto)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EstiloObjetoService);
exports.EstiloObjetoService = EstiloObjetoService;
//# sourceMappingURL=estilo-objeto.service.js.map