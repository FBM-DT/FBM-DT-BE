import { ApiProperty } from '@nestjs/swagger';

export class UserErrorResDto {
  @ApiProperty({ example: 400 })
  status: number;
  @ApiProperty({ example: 'v1' })
  version: string;
  @ApiProperty({ example: 'Failed' })
  message: string;
}
export class SuccessResDto {
  @ApiProperty({ example: 200 })
  status: number;
  @ApiProperty({ example: 'v1' })
  version: string;
  @ApiProperty({ example: 'Success' })
  message: string;
}

export class EmailNotExistsResDto extends SuccessResDto {
  @ApiProperty({
    example: {
      emailExists: false,
    },
  })
  data: object;
}

export class PhoneNumberNotExistsResDto extends SuccessResDto {
  @ApiProperty({
    example: {
      phonenumberExists: false,
    },
  })
  data: object;
}

export class EmailExistsResDto extends UserErrorResDto {
  @ApiProperty({ example: 'The email nampt@gmail.com already exists' })
  exception: string;
  @ApiProperty({
    example: {
      emailExists: true,
    },
  })
  data: object;
}

export class PhoneNumberExistsResDto extends UserErrorResDto {
  @ApiProperty({ example: 'The phone number 0961135481 already exists' })
  exception: string;
  @ApiProperty({
    example: {
      phonenumberExists: true,
    },
  })
  data: object;
}
