import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResDto {
  @ApiProperty({ example: 404 })
  status: number;
  @ApiProperty({ example: 'v1' })
  version: string;
  @ApiProperty({ example: 'Failed' })
  message: string;
  @ApiProperty({ example: 'The phone number 0326268879 does not exist' })
  exception: string;
}

export class BadRequestResDto {
  @ApiProperty({ example: 404 })
  status: number;
  @ApiProperty({ example: 'v1' })
  version: string;
  @ApiProperty({ example: 'Failed' })
  message: string;
  @ApiProperty({ example: 'The OTP is invalid' })
  exception: string;
  @ApiProperty({
    example: {
      status: 'rejected',
      message: 'You need to verify OTP first',
    },
  })
  data: object;
}
