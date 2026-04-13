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
exports.InventarioDeFelderService = void 0;
const common_1 = require("@nestjs/common");
const inventario_de_felder_entity_1 = require("./inventario_de_felder.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_service_1 = require("../generic/generic.service");
const perfil_final_inventario_de_felder_entity_1 = require("../perfil_final_inventario_de_felder/perfil_final_inventario_de_felder.entity");
const estrategias_ense_anza_service_1 = require("../estrategias_ense\u00F1anza/estrategias_ense\u00F1anza.service");
const alumnos_cuestionarios_service_1 = require("../alumnos_cuestionarios/alumnos_cuestionarios.service");
let InventarioDeFelderService = class InventarioDeFelderService extends generic_service_1.GenericService {
    constructor(InventarioDeFelderRepository, perfilFinalRepository, estrategiaEnseñanzaService, alumnosCuestionariosService) {
        super(InventarioDeFelderRepository);
        this.InventarioDeFelderRepository = InventarioDeFelderRepository;
        this.perfilFinalRepository = perfilFinalRepository;
        this.estrategiaEnseñanzaService = estrategiaEnseñanzaService;
        this.alumnosCuestionariosService = alumnosCuestionariosService;
    }
    async findEstadoEncuesta(numAlumno) {
        return this.InventarioDeFelderRepository.find({ where: { nro_cuenta: numAlumno } });
    }
    async saveResultadoEncuesta(resultadoEncuestaDto) {
        const existingResponse = await this.InventarioDeFelderRepository
            .findOne({
            where: { nro_cuenta: resultadoEncuestaDto.nro_cuenta }
        });
        let savedResponse;
        if (existingResponse) {
            existingResponse.respuestas_compactadas = resultadoEncuestaDto.respuestas_compactadas;
            existingResponse.grupo = resultadoEncuestaDto.grupo;
            await this.InventarioDeFelderRepository.save(existingResponse);
            savedResponse = await this.InventarioDeFelderRepository.save(existingResponse);
        }
        else {
            const newResponse = this.InventarioDeFelderRepository.create(resultadoEncuestaDto);
            savedResponse = await this.InventarioDeFelderRepository.save(newResponse);
        }
        try {
            await this.alumnosCuestionariosService.marcarCompletado(resultadoEncuestaDto.nro_cuenta, 1);
            console.log(`Cuestionario marcado como completado para alumno ${resultadoEncuestaDto.nro_cuenta}`);
        }
        catch (error) {
            console.error('Error al marcar cuestionario completado:', error.message);
        }
        return savedResponse;
    }
    async savePerfilfinal(resultadoEncuestaDto) {
        const existingProfile = await this.perfilFinalRepository.findOne({ where: { nro_cuenta: resultadoEncuestaDto.nro_cuenta } });
        const recuentos = {
            activo: 0,
            reflexivo: 0,
            sensorial: 0,
            intuitivo: 0,
            visual: 0,
            verbal: 0,
            secuencial: 0,
            global: 0,
            aux_1: "",
            aux_2: "",
            aux_3: "",
            aux_4: "",
        };
        for (let i = 0; i < 44; i++) {
            if ((i === 0) || (i === 4) || (i === 8) || (i === 12) || (i === 16) || (i === 20) || (i === 24) || (i === 28) || (i === 32) || (i === 36) || (i === 40)) {
                if (resultadoEncuestaDto.respuestas_compactadas[i] === "A") {
                    recuentos.activo++;
                }
                else if (resultadoEncuestaDto.respuestas_compactadas[i] === "B") {
                    recuentos.reflexivo++;
                }
            }
            else if ((i === 1) || (i === 5) || (i === 9) || (i === 13) || (i === 17) || (i === 21) || (i === 25) || (i === 29) || (i === 33) || (i === 37) || (i === 41)) {
                if (resultadoEncuestaDto.respuestas_compactadas[i] === "A") {
                    recuentos.sensorial++;
                }
                else if (resultadoEncuestaDto.respuestas_compactadas[i] === "B") {
                    recuentos.intuitivo++;
                }
            }
            else if ((i === 2) || (i === 6) || (i === 10) || (i === 14) || (i === 18) || (i === 22) || (i === 26) || (i === 30) || (i === 34) || (i === 38) || (i === 42)) {
                if (resultadoEncuestaDto.respuestas_compactadas[i] === "A") {
                    recuentos.visual++;
                }
                else if (resultadoEncuestaDto.respuestas_compactadas[i] === "B") {
                    recuentos.verbal++;
                }
            }
            else if ((i === 3) || (i === 7) || (i === 11) || (i === 15) || (i === 19) || (i === 23) || (i === 27) || (i === 31) || (i === 35) || (i === 39) || (i === 43)) {
                if (resultadoEncuestaDto.respuestas_compactadas[i] === "A") {
                    recuentos.secuencial++;
                }
                else if (resultadoEncuestaDto.respuestas_compactadas[i] === "B") {
                    recuentos.global++;
                }
            }
        }
        if (recuentos.activo > recuentos.reflexivo) {
            recuentos.aux_1 = recuentos.activo - recuentos.reflexivo + 'A';
        }
        else {
            recuentos.aux_1 = recuentos.reflexivo - recuentos.activo + 'B';
        }
        if (recuentos.sensorial > recuentos.intuitivo) {
            recuentos.aux_2 = recuentos.sensorial - recuentos.intuitivo + 'A';
        }
        else {
            recuentos.aux_2 = recuentos.intuitivo - recuentos.sensorial + 'B';
        }
        if (recuentos.visual > recuentos.verbal) {
            recuentos.aux_3 = recuentos.visual - recuentos.verbal + 'A';
        }
        else {
            recuentos.aux_3 = recuentos.verbal - recuentos.visual + 'B';
        }
        if (recuentos.secuencial > recuentos.global) {
            recuentos.aux_4 = recuentos.secuencial - recuentos.global + 'A';
        }
        else {
            recuentos.aux_4 = recuentos.global - recuentos.secuencial + 'B';
        }
        const perfilFinal = this.perfilFinalRepository.create({
            nro_cuenta: resultadoEncuestaDto.nro_cuenta,
            grupo: resultadoEncuestaDto.grupo,
            activo_reflexivo: recuentos.aux_1,
            sensorial_intuitivo: recuentos.aux_2,
            visual_verbal: recuentos.aux_3,
            secuencial_global: recuentos.aux_4,
        });
        if (existingProfile) {
            existingProfile.activo_reflexivo = recuentos.aux_1;
            existingProfile.sensorial_intuitivo = recuentos.aux_2;
            existingProfile.visual_verbal = recuentos.aux_3;
            existingProfile.secuencial_global = recuentos.aux_4;
            await this.perfilFinalRepository.save(existingProfile);
            await this.estrategiaEnseñanzaService.generarEstrategia(resultadoEncuestaDto.nro_cuenta);
            await this.estrategiaEnseñanzaService.calcularYGuardarModaParaGrupo(resultadoEncuestaDto.grupo);
            return existingProfile;
        }
        else {
            await this.perfilFinalRepository.save(perfilFinal);
            await this.estrategiaEnseñanzaService.generarEstrategia(resultadoEncuestaDto.nro_cuenta);
            await this.estrategiaEnseñanzaService.calcularYGuardarModaParaGrupo(resultadoEncuestaDto.grupo);
            return perfilFinal;
        }
    }
};
InventarioDeFelderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventario_de_felder_entity_1.InventarioDeFelder)),
    __param(1, (0, typeorm_1.InjectRepository)(perfil_final_inventario_de_felder_entity_1.PerfilFinalInventarioDeFelder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        estrategias_ense_anza_service_1.EstrategiaEnsenanzaService,
        alumnos_cuestionarios_service_1.AlumnosCuestionariosService])
], InventarioDeFelderService);
exports.InventarioDeFelderService = InventarioDeFelderService;
//# sourceMappingURL=inventario_de_felder.service.js.map