import { PartialType } from '@nestjs/swagger';
import { AddDepartmentReqDto } from '../req';

export class ListDepartmentResDto extends PartialType(AddDepartmentReqDto) {}
