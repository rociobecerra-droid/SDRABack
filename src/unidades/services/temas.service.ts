import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericService } from 'src/generic/generic.service';
import { Temas } from '../entities/temas.entity';

@Injectable()
export class TemasService extends GenericService<Temas> {
    constructor(
        @InjectRepository(Temas)
        private readonly temasRepository: Repository<Temas>
    ) {
        super(temasRepository);
    }

    async findByUnidadId(idUnidad: number): Promise<Temas[]> {
        return this.temasRepository.find({
        where: { id_unidad: idUnidad },
        relations: ['objetosAprendizaje'],
        order: { numero_tema: 'ASC' }
        });
    }

    async findWithObjetos(id: number): Promise<Temas> {
        return this.temasRepository.findOne({
        where: { id },
        relations: ['objetosAprendizaje', 'unidad']
        });
    }

    async updateTema(id: number, updateTemaDto: any): Promise<Temas> {
        const tema = await this.temasRepository.findOne({ where: { id } });
        if (!tema) {
            throw new Error(`Tema with ID ${id} not found`);
        }
        this.temasRepository.merge(tema, updateTemaDto);
        console.log('Merged Tema:', tema);
        return this.temasRepository.save(tema);
    }
}