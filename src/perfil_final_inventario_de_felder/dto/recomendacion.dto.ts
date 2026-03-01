import { EstiloObjeto } from 'src/unidades/entities/estilo_objeto.entity';
import { ObjetosAprendizaje } from 'src/unidades/entities/objetos_aprendizaje.entity';

export class RecomendacionObjetoDto {
    objeto: ObjetosAprendizaje;
    estiloObjeto: EstiloObjeto;
    estilosCompatibles: string[];
}

export class ResultadoRecomendacionDto {
    mensaje?: string;
    objetos: RecomendacionObjetoDto[];
    totalCompatibles: number;
    estilosEstudiante: string[];
}