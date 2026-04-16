import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  InsertResult,
  Repository,
} from 'typeorm';
import {
  QueryDeepPartialEntity,
  QueryPartialEntity,
} from 'typeorm/query-builder/QueryPartialEntity';
import { GenericEntity } from './generic.entity';
import { NotFoundException } from '@nestjs/common';

export abstract class GenericService<Entity extends GenericEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  create(
    entity: QueryPartialEntity<Entity> | QueryPartialEntity<Entity>[] | Entity,
  ): Promise<InsertResult> {
    return this.repository.insert(entity as QueryDeepPartialEntity<Entity>);
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options);
  }

  findOne(options?: FindOneOptions<Entity>): Promise<Entity> {
    return this.repository.findOne(options);
  }

  findOneById(id): Promise<Entity> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id, entity: any) {
    const info = await this.repository.findOne({ where: { id } });
    if (!info) {
      throw new NotFoundException(`Registro con id ${id} no encontrado`);
    }
    console.log('Antes del merge:', info);
    console.log('Datos a aplicar:', entity);
    
    this.repository.merge(info, entity);

    console.log('Después del merge (info modificado):', info);
    return this.repository.save(info);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repository.softDelete(id);
  }
}
