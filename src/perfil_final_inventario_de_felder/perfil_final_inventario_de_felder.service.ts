import { Injectable, NotFoundException } from '@nestjs/common';
import { PerfilFinalInventarioDeFelder } from './perfil_final_inventario_de_felder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { Grupos } from 'src/grupos/grupos.entity';
import { ObjetosAprendizaje } from 'src/unidades/entities/objetos_aprendizaje.entity';
import { EstiloObjeto } from 'src/unidades/entities/estilo_objeto.entity';
import { RecomendacionObjetoDto, ResultadoRecomendacionDto } from './dto/recomendacion.dto';

interface RecomendacionObjeto {
  objeto: ObjetosAprendizaje;
  estilosCompatibles: string[];
}

interface ResultadoRecomendacion {
  mensaje?: string;
  objetos: RecomendacionObjeto[];
  totalCompatibles: number;
  estilosEstudiante: string[];
}


@Injectable()
export class PerfilFinalInventarioDeFelderService extends GenericService<PerfilFinalInventarioDeFelder> {
  constructor(
    @InjectRepository(PerfilFinalInventarioDeFelder)
    private readonly perfilFinalInventarioDeFelderRepository: Repository<PerfilFinalInventarioDeFelder>,
    @InjectRepository(Grupos) 
    private gruposRepository: Repository<Grupos>,
    @InjectRepository(ObjetosAprendizaje)
    private objetosAprendizajeRepository: Repository<ObjetosAprendizaje>,
    @InjectRepository(EstiloObjeto)
    private estiloObjetoRepository: Repository<EstiloObjeto>,
  ) {
    super(perfilFinalInventarioDeFelderRepository);
  }

  async findByGrupoIds(ids: number[]): Promise<PerfilFinalInventarioDeFelder[]> {
    return this.perfilFinalInventarioDeFelderRepository.find({ where: { grupo: In(ids) } });
  }

  async findByAlumnoIds(ids: number[]): Promise<PerfilFinalInventarioDeFelder[]> {
    return this.perfilFinalInventarioDeFelderRepository.find({ where: { grupo: In(ids) } });
  }

  async findResultadoAlumno(numAlumno: number): Promise<PerfilFinalInventarioDeFelder[]> {
    return this.perfilFinalInventarioDeFelderRepository.find({ where: { nro_cuenta: numAlumno } });
  }

  find(options?: FindManyOptions<PerfilFinalInventarioDeFelder>): Promise<PerfilFinalInventarioDeFelder[]> {
    return this.perfilFinalInventarioDeFelderRepository.find(options);
  }

  //Calcular la moda de inventario de Felder
  async findModaEstrategiasByNumGrupo(numGrupo: number): Promise<string[]> {
    const perfiles = await this.perfilFinalInventarioDeFelderRepository.find({
      where: { grupo: numGrupo },
      relations: ['ee1', 'ee2', 'ee3', 'ee4'],
    });//Ojo numGrupo es para el numero grupo especificamente

    // Crear un objeto para realizar un seguimiento de la frecuencia de cada estrategia de enseñanza
    const estrategiasFrecuencia: { [key: string]: number } = {};

    // Recorrer los perfiles y contar la frecuencia de cada estrategia de enseñanza
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

    // Convertir el objeto de frecuencia en un array de objetos [{ estrategia: string, frecuencia: number }]
    const estrategiasFrecuenciaArray = Object.keys(estrategiasFrecuencia).map((estrategia) => ({
      estrategia,
      frecuencia: estrategiasFrecuencia[estrategia],
    }));

    // Ordenar el array de estrategias por frecuencia de mayor a menor
    estrategiasFrecuenciaArray.sort((a, b) => b.frecuencia - a.frecuencia);

    // Obtener las estrategias ordenadas y limitarlas a 4
    const estrategiasOrdenadas = estrategiasFrecuenciaArray.map((item) => item.estrategia);
    const estrategiasLimitadas = estrategiasOrdenadas.slice(0, 4);

    return estrategiasLimitadas;
  }

// ===== ALGORITMO DE RECOMENDACIÓN =====

  /**
   * Mapa de estilos opuestos por dimension.
   */
  private readonly estiloOpuesto: Record<string, string> = {
    activo: 'reflexivo',
    reflexivo: 'activo',
    sensorial: 'intuitivo',
    intuitivo: 'sensorial',
    visual: 'verbal',
    verbal: 'visual',
    secuencial: 'global',
    global: 'secuencial',
  };

  /**
   * Extrae las dimensiones de aprendizaje del perfil del estudiante.
   * Para puntajes bajos (1 o 3), incluye tambien el estilo opuesto como fallback
   * ya que el alumno tiene equilibrio entre ambos estilos de esa dimension.
   *
   * - estiloPrincipal: el estilo dominante de la dimension
   * - estiloFallback: el opuesto (solo si puntaje <= 3, sino null)
   * - puntaje: intensidad de la preferencia
   */
  private extraerDimensiones(perfil: PerfilFinalInventarioDeFelder): {
    estiloPrincipal: string;
    estiloFallback: string | null;
    puntaje: number;
  }[] {
    const UMBRAL_EQUILIBRIO = 3;

    const parseDimension = (raw: string, estiloA: string, estiloB: string) => {
      const puntaje = parseInt(raw.match(/\d+/)?.[0] || '0');
      const tipo = raw.charAt(raw.length - 1);
      const estiloPrincipal = tipo === 'A' ? estiloA : estiloB;
      const estiloFallback = puntaje <= UMBRAL_EQUILIBRIO
        ? this.estiloOpuesto[estiloPrincipal]
        : null;
      return { estiloPrincipal, estiloFallback, puntaje };
    };

    const dimensiones = [
      parseDimension(perfil.activo_reflexivo,   'activo',     'reflexivo'),
      parseDimension(perfil.sensorial_intuitivo, 'sensorial',  'intuitivo'),
      parseDimension(perfil.visual_verbal,       'visual',     'verbal'),
      parseDimension(perfil.secuencial_global,   'secuencial', 'global'),
    ];

    // Ordenar por puntaje descendente (mayor preferencia primero)
    return dimensiones.sort((a, b) => b.puntaje - a.puntaje);
  }

  /**
   * Busca objetos de un tema que coincidan con un estilo dado.
   * Retorna solo los que no estén ya en el mapa (evita duplicados).
   */
  private buscarObjetosPorEstilo(
    objetos: ObjetosAprendizaje[],
    estilo: string,
    todosLosEstilosDelAlumno: string[],
    mapaAcumulado: Map<number, RecomendacionObjetoDto>
  ): number {
    let encontrados = 0;
    for (const objeto of objetos) {
      if (objeto.estiloObjeto?.estilos?.includes(estilo)) {
        if (!mapaAcumulado.has(objeto.id)) {
          const estilosCompatibles = todosLosEstilosDelAlumno.filter(e =>
            objeto.estiloObjeto.estilos.includes(e)
          );
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

  /**
   * Recomienda objetos de aprendizaje para un tema especifico
   * basandose en el perfil del estudiante.
   *
   * Logica por dimension:
   * - Puntaje 5, 7, 11: solo busca con el estilo dominante.
   * - Puntaje 1 o 3: busca primero con el estilo dominante;
   *                       si no encuentra nada, usa el estilo opuesto como fallback.
   *
   * Los resultados de las 4 dimensiones se acumulan sin duplicar objetos.
   */
  async recomendarObjetosParaTema(
    nroCuenta: number,
    idTema: number
  ): Promise<ResultadoRecomendacionDto> {
    // 1. Obtener el perfil del estudiante
    const perfil = await this.perfilFinalInventarioDeFelderRepository.findOne({
      where: { nro_cuenta: nroCuenta }
    });

    if (!perfil) {
      throw new NotFoundException(
        `No se encontro perfil para el estudiante con numero de cuenta ${nroCuenta}`
      );
    }

    // 2. Extraer dimensiones (ordenadas por puntaje descendente)
    const dimensiones = this.extraerDimensiones(perfil);

    // Lista plana de los estilos principales para calcular compatibilidad
    const todosLosEstilosDelAlumno = dimensiones.map(d => d.estiloPrincipal);

    // 3. Obtener todos los objetos del tema
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

    // 4. Recorrer dimensiones acumulando objetos
    const mapaAcumulado = new Map<number, RecomendacionObjetoDto>();
    const estilosConResultados: string[] = [];

    for (const dimension of dimensiones) {
      const { estiloPrincipal, estiloFallback } = dimension;

      // Buscar con el estilo principal
      const encontradosPrincipal = this.buscarObjetosPorEstilo(
        objetos, estiloPrincipal, todosLosEstilosDelAlumno, mapaAcumulado
      );

      if (encontradosPrincipal > 0) {
        estilosConResultados.push(estiloPrincipal);
      } else if (estiloFallback) {
        // Puntaje <= 3 y no se encontro nada con el principal → usar fallback
        const encontradosFallback = this.buscarObjetosPorEstilo(
          objetos, estiloFallback, todosLosEstilosDelAlumno, mapaAcumulado
        );
        if (encontradosFallback > 0) {
          estilosConResultados.push(estiloFallback);
        }
      }
    }

    const objetosEncontrados = Array.from(mapaAcumulado.values());

    // 5. Preparar respuesta
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
}
