import { WORKTYPE } from "src/core/constants";
import { ShareEntity } from "src/core/shared";
import { Column, Entity, OneToMany } from "typeorm";
import { Staff_Shift } from "./staffInShift.entity";
import { Task } from "src/modules/task/task.entity";

@Entity()
export class WorkShift extends ShareEntity{
    @Column({
        type: 'varchar',
        length: 1000,
        nullable: false
    })
    name: string;

    @Column({
        type: 'enum',
        enum: WORKTYPE,
        default: WORKTYPE.DAILY
    })
    type: WORKTYPE;

    @Column({
        type: 'varchar',
        length: 1000,
        nullable: false
    })
    address: string;

    @Column({
        type: 'varchar',
        length: 1000,
        nullable: false
    })
    duration: string;

    @Column({
        type: 'varchar',
        length: 1000,
        nullable: true
    })
    description: string;

    @OneToMany(()=>Staff_Shift,(staffShift)=>staffShift.workShiftId)
    staffShifts: Staff_Shift[];
    @OneToMany(()=>Task,(task)=>task.workShiftId)
    tasks: Task
}