import { Column, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { WorkShift } from "./work-shift.entity";
import { User } from "src/modules/users/user.entity";
import { ShareEntity } from "src/core/shared";

@Entity()
export class Staff_Shift extends ShareEntity{
    
    @Column({
        type: 'int',
        nullable: false
    })
    workShiftId: number;

    @ManyToOne(()=>WorkShift, (ws)=>ws.staffShifts,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'workShiftId'})
    workShift: WorkShift;

    @Column({
        type: 'int',
        nullable: false
    })
    staffId: number;

    @ManyToOne(()=>User, (staff)=>staff.staffShifts, {onDelete:'CASCADE'})
    @JoinColumn({name: 'staffId'})
    staff:User

    @Column({
        type: 'date',
        nullable: true
    })
    startAt: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    endTime: Date;
}