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
exports.GruposService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grupos_entity_1 = require("./grupos.entity");
const generic_service_1 = require("../generic/generic.service");
const estrategias_ense_anza_service_1 = require("../estrategias_ense\u00F1anza/estrategias_ense\u00F1anza.service");
const perfil_final_inventario_de_felder_entity_1 = require("../perfil_final_inventario_de_felder/perfil_final_inventario_de_felder.entity");
let GruposService = class GruposService extends generic_service_1.GenericService {
    constructor(gruposRepository, perfilFinalRepository, estrategiasEnsenanzaService) {
        super(gruposRepository);
        this.gruposRepository = gruposRepository;
        this.perfilFinalRepository = perfilFinalRepository;
        this.estrategiasEnsenanzaService = estrategiasEnsenanzaService;
    }
    async findByNumGrupo(numGrupo) {
        return this.gruposRepository.findOne({ where: { grupo: numGrupo }, relations: ['cuestionario'] });
    }
    async findByGrupoIds(ids) {
        return this.gruposRepository.find({ where: { id_grupo: (0, typeorm_2.In)(ids) } });
    }
    async obtenerNumerosGrupo() {
        const grupos = await this.gruposRepository
            .createQueryBuilder('grupo')
            .select('DISTINCT grupo.grupo', 'grupo')
            .where('grupo.deleted IS NULL')
            .orderBy('grupo.grupo', 'ASC')
            .getRawMany();
        return grupos.map(g => g.grupo);
    }
    async asignarEstrategias(grupoId, estrategiasIds) {
        const grupo = await this.gruposRepository.findOne({ where: { grupo: grupoId } });
        if (!grupo) {
            throw new Error(`Grupo con ID ${grupoId} no encontrado`);
        }
        const estrategiasAsignadas = await this.estrategiasEnsenanzaService.find({ where: { id: (0, typeorm_2.In)(estrategiasIds) } });
        grupo.ee1 = estrategiasAsignadas.find(estrategia => estrategia.id === grupo.ee1.id);
        grupo.ee2 = estrategiasAsignadas.find(estrategia => estrategia.id === grupo.ee2.id);
        grupo.ee3 = estrategiasAsignadas.find(estrategia => estrategia.id === grupo.ee3.id);
        grupo.ee4 = estrategiasAsignadas.find(estrategia => estrategia.id === grupo.ee4.id);
        await this.gruposRepository.save(grupo);
        return grupo;
    }
    async obtenerConteoAlumnosPorEstrategia(numGrupo, topResultados = 4) {
        const perfiles = await this.perfilFinalRepository.find({
            where: { grupo: numGrupo },
            relations: ['ee1', 'ee2', 'ee3', 'ee4'],
        });
        const conteoAlumnosPorEstrategia = {};
        perfiles.forEach((perfil) => {
            ['ee1', 'ee2', 'ee3', 'ee4'].forEach((estrategia) => {
                const estrategiaId = perfil[estrategia] ? perfil[estrategia].id.toString() : 'N/A';
                conteoAlumnosPorEstrategia[estrategiaId] = (conteoAlumnosPorEstrategia[estrategiaId] || 0) + 1;
            });
        });
        const conteoOrdenado = Object.entries(conteoAlumnosPorEstrategia)
            .sort(([, a], [, b]) => b - a)
            .slice(0, topResultados)
            .reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {});
        return conteoOrdenado;
    }
};
GruposService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grupos_entity_1.Grupos)),
    __param(1, (0, typeorm_1.InjectRepository)(perfil_final_inventario_de_felder_entity_1.PerfilFinalInventarioDeFelder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        estrategias_ense_anza_service_1.EstrategiaEnsenanzaService])
], GruposService);
exports.GruposService = GruposService;
//# sourceMappingURL=grupos.service.js.map