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
        this.estiloOpuesto = {
            activo: 'reflexivo',
            reflexivo: 'activo',
            sensorial: 'intuitivo',
            intuitivo: 'sensorial',
            visual: 'verbal',
            verbal: 'visual',
            secuencial: 'global',
            global: 'secuencial',
        };
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
    extraerDimensiones(perfil) {
        const UMBRAL_EQUILIBRIO = 3;
        const parseDimension = (raw, estiloA, estiloB) => {
            var _a;
            const puntaje = parseInt(((_a = raw.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '0');
            const tipo = raw.charAt(raw.length - 1);
            const estiloPrincipal = tipo === 'A' ? estiloA : estiloB;
            const estiloFallback = puntaje <= UMBRAL_EQUILIBRIO
                ? this.estiloOpuesto[estiloPrincipal]
                : null;
            return { estiloPrincipal, estiloFallback, puntaje };
        };
        const dimensiones = [
            parseDimension(perfil.activo_reflexivo, 'activo', 'reflexivo'),
            parseDimension(perfil.sensorial_intuitivo, 'sensorial', 'intuitivo'),
            parseDimension(perfil.visual_verbal, 'visual', 'verbal'),
            parseDimension(perfil.secuencial_global, 'secuencial', 'global'),
        ];
        return dimensiones.sort((a, b) => b.puntaje - a.puntaje);
    }
    buscarObjetosPorEstilo(objetos, estilo, todosLosEstilosDelAlumno, mapaAcumulado) {
        var _a, _b;
        let encontrados = 0;
        for (const objeto of objetos) {
            if ((_b = (_a = objeto.estiloObjeto) === null || _a === void 0 ? void 0 : _a.estilos) === null || _b === void 0 ? void 0 : _b.includes(estilo)) {
                if (!mapaAcumulado.has(objeto.id)) {
                    const estilosCompatibles = todosLosEstilosDelAlumno.filter(e => objeto.estiloObjeto.estilos.includes(e));
                    mapaAcumulado.set(objeto.id, {
                        objeto,
                        estiloObjeto: objeto.estiloObjeto,
                        estilosCompatibles,
                    });
                }
                encontrados++;
            }
        }
        return encontrados;
    }
    async recomendarObjetosParaTema(nroCuenta, idTema) {
        const perfil = await this.perfilFinalInventarioDeFelderRepository.findOne({
            where: { nro_cuenta: nroCuenta }
        });
        if (!perfil) {
            throw new common_1.NotFoundException(`No se encontro perfil para el estudiante con numero de cuenta ${nroCuenta}`);
        }
        const dimensiones = this.extraerDimensiones(perfil);
        const todosLosEstilosDelAlumno = dimensiones.map(d => d.estiloPrincipal);
        const objetos = await this.objetosAprendizajeRepository.find({
            where: { id_tema: idTema },
            relations: ['estiloObjeto', 'tema'],
        });
        if (objetos.length === 0) {
            return {
                mensaje: 'No hay objetos de aprendizaje disponibles para este tema',
                objetos: [],
                totalCompatibles: 0,
                estilosEstudiante: todosLosEstilosDelAlumno,
            };
        }
        const mapaAcumulado = new Map();
        const estilosConResultados = [];
        for (const dimension of dimensiones) {
            const { estiloPrincipal, estiloFallback } = dimension;
            const encontradosPrincipal = this.buscarObjetosPorEstilo(objetos, estiloPrincipal, todosLosEstilosDelAlumno, mapaAcumulado);
            if (encontradosPrincipal > 0) {
                estilosConResultados.push(estiloPrincipal);
            }
            else if (estiloFallback) {
                const encontradosFallback = this.buscarObjetosPorEstilo(objetos, estiloFallback, todosLosEstilosDelAlumno, mapaAcumulado);
                if (encontradosFallback > 0) {
                    estilosConResultados.push(estiloFallback);
                }
            }
        }
        const objetosEncontrados = Array.from(mapaAcumulado.values());
        if (objetosEncontrados.length === 0) {
            return {
                mensaje: 'No se encontraron objetos de aprendizaje compatibles con tus estilos de aprendizaje.',
                objetos: [],
                totalCompatibles: 0,
                estilosEstudiante: todosLosEstilosDelAlumno,
            };
        }
        return {
            mensaje: `Se encontraron ${objetosEncontrados.length} objeto(s) de aprendizaje compatible(s) con tus estilos (${estilosConResultados.join(', ')})`,
            objetos: objetosEncontrados,
            totalCompatibles: objetosEncontrados.length,
            estilosEstudiante: todosLosEstilosDelAlumno,
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