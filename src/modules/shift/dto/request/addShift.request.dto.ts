import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { WORKTYPE } from "../../../../core/constants";

export class AddWorkShiftRequestDto{
    @IsNotEmpty({message: 'The work shift name is required'})
    @IsString({message: 'The workshift name must be string type'})
    readonly name: string;

    @IsNotEmpty({message: 'The work shift type is required'})
    @IsEnum(WORKTYPE,{message: 'The type of work shift must be belonged to the enum'})
    readonly type: WORKTYPE;

    @IsNotEmpty({message: 'The work shift address is required'})
    @IsString({message: 'The work shift address must be string type'})
    readonly address: string;

    @IsNotEmpty({message: 'The work shift duration is required'})
    @IsString({message: 'The work shift duration must be string type'})
    readonly duration: string;

    @IsOptional()
    @IsString({message: 'The work shift description must be string type'})
    readonly description: string;
}