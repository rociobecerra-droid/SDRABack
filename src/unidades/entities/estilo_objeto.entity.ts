import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { GenericEntity } from 'src/generic/generic.entity';

@Entity()
export class EstiloObjeto extends GenericEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    objeto: string;

    @Column({ 
        type: 'json',
        default: () => "'[]'"
    })
    estilos: string[];

    @Column({ 
        type: 'varchar', 
        length: 100,
        nullable: true  
    })
    tipo: string;
}