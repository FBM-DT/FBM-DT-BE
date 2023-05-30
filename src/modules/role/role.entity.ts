import { ShareEntity } from "src/core/shared";
import { Column, Entity } from "typeorm";

@Entity()
export class Role extends ShareEntity{
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    name: string
}