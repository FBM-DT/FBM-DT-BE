import { Column, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { WorkShift } from "./workShift.entity";
import { User } from "../../../modules/users/user.entity";
import { ShareEntity } from "../../../core/shared";

@Entity()
export class StaffShift extends ShareEntity{
    
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
    userId: number;

    @ManyToOne(()=>User, (staff)=>staff.staffShifts, {onDelete:'CASCADE'})
    @JoinColumn({name: 'userId'})
    user:User

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