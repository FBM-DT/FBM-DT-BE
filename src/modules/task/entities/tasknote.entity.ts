import { ShareEntity } from "../../../core/shared";
import { Column, Entity } from "typeorm";

@Entity()
export class TaskNote extends ShareEntity{
    @Column()
    context: string;
}