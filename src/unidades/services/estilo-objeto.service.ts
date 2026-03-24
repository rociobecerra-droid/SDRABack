import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { EstiloObjeto } from '../entities/estilo_objeto.entity';

@Injectable()
export class EstiloObjetoService extends GenericService<EstiloObjeto> {
    constructor(
        @InjectRepository(EstiloObjeto)
        private readonly estiloObjetoRepository: Repository<EstiloObjeto>
    ) {
        super(estiloObjetoRepository);
    }

    async findByObjeto(objeto: string): Promise<EstiloObjeto> {
        return this.estiloObjetoRepository.findOne({
            where: { objeto }
        });
    }

    async findByEstilo(estilo: string): Promise<EstiloObjeto[]> {
        return this.estiloObjetoRepository
            .createQueryBuilder('estilo_objeto')
            .where('JSON_CONTAINS(estilo_objeto.estilos, :estilo)', { 
                estilo: JSON.stringify(estilo) 
            })
            .getMany();
    }

    async addEstiloToObjeto(id: number, nuevoEstilo: string): Promise<EstiloObjeto> {
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

    async removeEstiloFromObjeto(id: number, estiloARemover: string): Promise<EstiloObjeto> {
        const estiloObjeto = await this.estiloObjetoRepository.findOne({ 
            where: { id } 
        });
        
        if (!estiloObjeto) {
            throw new Error(`EstiloObjeto con id ${id} no encontrado`);
        }

        estiloObjeto.estilos = estiloObjeto.estilos.filter(
            estilo => estilo !== estiloARemover
        );
        
        return this.estiloObjetoRepository.save(estiloObjeto);
    }

    async findAllStyles(): Promise<EstiloObjeto[]> {
        return this.estiloObjetoRepository.find({
            order: { objeto: 'ASC' }
        });
    }
}