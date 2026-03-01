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
exports.PerfilFinalInventarioDeFelderService = void 0;
const common_1 = require("@nestjs/common");
const perfil_final_inventario_de_felder_entity_1 = require("./perfil_final_inventario_de_felder.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generic_service_1 = require("../generic/generic.service");
const grupos_entity_1 = require("../grupos/grupos.entity");
const objetos_aprendizaje_entity_1 = require("../unidades/entities/objetos_aprendizaje.entity");
const estilo_objeto_entity_1 = require("../unidades/entities/estilo_objeto.entity");
let PerfilFinalInventarioDeFelderService = class PerfilFinalInventarioDeFelderService extends generic_service_1.GenericService {
    constructor(perfilFinalInventarioDeFelderRepository, gruposRepository, objetosAprendizajeRepository, estiloObjetoRepository) {
        super(perfilFinalInventarioDeFelderRepository);
        this.perfilFinalInventarioDeFelderRepository = perfilFinalInventarioDeFelderRepository;
        this.gruposRepository = gruposRepository;
        this.objetosAprendizajeRepository = objetosAprendizajeRepository;
        this.estiloObjetoRepository = estiloObjetoRepository;
    }
    async findByGrupoIds(ids) {
        return this.perfilFinalInventarioDeFelderRepository.find({ where: { grupo: (0, typeorm_2.In)(ids) } });
    }
    async findByAlumnoIds(ids) {
        return this.perfilFinalInventarioDeFelderRepository.find({ where: { grupo: (0, typeorm_2.In)(ids) } });
    }
    async findResultadoAlumno(numAlumno) {
        return this.perfilFinalInventarioDeFelderRepository.find({ where: { nro_cuenta: numAlumno } });
    }
    find(options) {
        return this.perfilFinalInventarioDeFelderRepository.find(options);
    }
    async findModaEstrategiasByNumGrupo(numGrupo) {
        const perfiles = await this.perfilFinalInventarioDeFelderRepository.find({
            where: { grupo: numGrupo },
            relations: ['ee1', 'ee2', 'ee3', 'ee4'],
        });
        const estrategiasFrecuencia = {};
        perfiles.forEach((perfil) => {
            if (perfil.ee1 && perfil.ee1.titulo) {
                estrategiasFrecuencia[perfil.ee1.titulo] = (estrategiasFrecuencia[perfil.ee1.titulo] || 0) + 1;
            }
            if (perfil.ee2 && perfil.ee2.titulo) {
                estrategiasFrecuencia[perfil.ee2.titulo] = (estrategiasFrecuencia[perfil.ee2.titulo] || 0) + 1;
            }
            if (perfil.ee3 && perfil.ee3.titulo) {
                estrategiasFrecuencia[perfil.ee3.titulo] = (estrategiasFrecuencia[perfil.ee3.titulo] || 0) + 1;
            }
            if (perfil.ee4 && perfil.ee4.titulo) {
                estrategiasFrecuencia[perfil.ee4.titulo] = (estrategiasFrecuencia[perfil.ee4.titulo] || 0) + 1;
            }
        });
        const estrategiasFrecuenciaArray = Object.keys(estrategiasFrecuencia).map((estrategia) => ({
            estrategia,
            frecuencia: estrategiasFrecuencia[estrategia],
        }));
        estrategiasFrecuenciaArray.sort((a, b) => b.frecuencia - a.frecuencia);
        const estrategiasOrdenadas = estrategiasFrecuenciaArray.map((item) => item.estrategia);
        const estrategiasLimitadas = estrategiasOrdenadas.slice(0, 4);
        return estrategiasLimitadas;
    }
    extraerEstilos(perfil) {
        var _a, _b, _c, _d;
        const estilos = [];
        const ar = perfil.activo_reflexivo;
        const puntajeAR = parseInt(((_a = ar.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '0');
        const tipoAR = ar.charAt(ar.length - 1);
        estilos.push({
            estilo: tipoAR === 'A' ? 'activo' : 'reflexivo',
            puntaje: puntajeAR
        });
        const si = perfil.sensorial_intuitivo;
        const puntajeSI = parseInt(((_b = si.match(/\d+/)) === null || _b === void 0 ? void 0 : _b[0]) || '0');
        const tipoSI = si.charAt(si.length - 1);
        estilos.push({
            estilo: tipoSI === 'A' ? 'sensorial' : 'intuitivo',
            puntaje: puntajeSI
        });
        const vv = perfil.visual_verbal;
        const puntajeVV = parseInt(((_c = vv.match(/\d+/)) === null || _c === void 0 ? void 0 : _c[0]) || '0');
        const tipoVV = vv.charAt(vv.length - 1);
        estilos.push({
            estilo: tipoVV === 'A' ? 'visual' : 'verbal',
            puntaje: puntajeVV
        });
        const sg = perfil.secuencial_global;
        const puntajeSG = parseInt(((_d = sg.match(/\d+/)) === null || _d === void 0 ? void 0 : _d[0]) || '0');
        const tipoSG = sg.charAt(sg.length - 1);
        estilos.push({
            estilo: tipoSG === 'A' ? 'secuencial' : 'global',
            puntaje: puntajeSG
        });
        return estilos.sort((a, b) => b.puntaje - a.puntaje);
    }
    async recomendarObjetosParaTema(nroCuenta, idTema) {
        const perfil = await this.perfilFinalInventarioDeFelderRepository.findOne({
            where: { nro_cuenta: nroCuenta }
        });
        if (!perfil) {
            throw new common_1.NotFoundException(`No se encontró perfil para el estudiante con número de cuenta ${nroCuenta}`);
        }
        const estilosEstudiante = this.extraerEstilos(perfil);
        const nombresEstilos = estilosEstudiante.map(e => e.estilo);
        const objetos = await this.objetosAprendizajeRepository.find({
            where: { id_tema: idTema },
            relations: ['estiloObjeto', 'tema']
        });
        if (objetos.length === 0) {
            return {
                mensaje: 'No hay objetos de aprendizaje disponibles para este tema',
                objetos: [],
                totalCompatibles: 0,
                estilosEstudiante: nombresEstilos
            };
        }
        const objetosEncontradosMap = new Map();
        const estilosConResultados = [];
        for (const estiloInfo of estilosEstudiante) {
            const estiloBuscado = estiloInfo.estilo;
            let encontradosEnEsteEstilo = 0;
            for (const objeto of objetos) {
                if (objeto.estiloObjeto && objeto.estiloObjeto.estilos) {
                    const estilosObjeto = objeto.estiloObjeto.estilos;
                    if (estilosObjeto.includes(estiloBuscado)) {
                        if (!objetosEncontradosMap.has(objeto.id)) {
                            const estilosCompatibles = estilosEstudiante
                                .filter(e => estilosObjeto.includes(e.estilo))
                                .map(e => e.estilo);
                            objetosEncontradosMap.set(objeto.id, {
                                objeto,
                                estiloObjeto: objeto.estiloObjeto,
                                estilosCompatibles
                            });
                        }
                        encontradosEnEsteEstilo++;
                    }
                }
            }
            if (encontradosEnEsteEstilo > 0) {
                estilosConResultados.push(estiloBuscado);
            }
        }
        const objetosEncontrados = Array.from(objetosEncontradosMap.values());
        if (objetosEncontrados.length === 0) {
            return {
                mensaje: `No se encontraron objetos de aprendizaje compatibles con tus estilos de aprendizaje.`,
                objetos: [],
                totalCompatibles: 0,
                estilosEstudiante: nombresEstilos
            };
        }
        return {
            mensaje: `Se encontraron ${objetosEncontrados.length} objeto(s) de aprendizaje compatible(s) con tus estilos (${estilosConResultados.join(', ')})`,
            objetos: objetosEncontrados,
            totalCompatibles: objetosEncontrados.length,
            estilosEstudiante: nombresEstilos
        };
    }
};
PerfilFinalInventarioDeFelderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(perfil_final_inventario_de_felder_entity_1.PerfilFinalInventarioDeFelder)),
    __param(1, (0, typeorm_1.InjectRepository)(grupos_entity_1.Grupos)),
    __param(2, (0, typeorm_1.InjectRepository)(objetos_aprendizaje_entity_1.ObjetosAprendizaje)),
    __param(3, (0, typeorm_1.InjectRepository)(estilo_objeto_entity_1.EstiloObjeto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PerfilFinalInventarioDeFelderService);
exports.PerfilFinalInventarioDeFelderService = PerfilFinalInventarioDeFelderService;
//# sourceMappingURL=perfil_final_inventario_de_felder.service.js.map