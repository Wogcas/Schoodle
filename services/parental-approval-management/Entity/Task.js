import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id;

    @Column({ type: 'varchar', length: 255 })
    nombre;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'APPROVED'],
        default: 'PENDING'
    })
    status;

}