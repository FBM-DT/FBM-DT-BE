import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { TwilioService } from 'nestjs-twilio';
import { OTPResDto, VerifyOTPResDto } from '../dto/response';
import { AppResponse } from '@BE/core/shared/app.response';
import * as speakeasy from 'speakeasy';
import { ErrorHandler } from '@BE/core/shared/common/error';
import { Account } from '../account.entity';
import { TYPEORM } from '@BE/core/constants';

@Injectable()
export class OtpService {
  private readonly otpSecret: string;
  private _dataSource: DataSource;
  private _accountRepository: Repository<Account>;
  constructor(
    @Inject(TYPEORM) dataSource: DataSource,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {
    this.otpSecret = speakeasy.generateSecret().base32;
    this._dataSource = dataSource;
    this._accountRepository = dataSource.getRepository(Account);
  }

  async generateOtp() {
    const otp = await speakeasy.totp({
      secret: this.otpSecret,
      encoding: 'base32',
    });
    return otp;
  }

  async sendOtp(phonenumber: string): Promise<OTPResDto> {
    try {
      const param = JSON.stringify(phonenumber);
      const jsonData = JSON.parse(param);
      const phoneNumber = jsonData.phonenumber;
      const formatPhoneNumber = `+84${phoneNumber}`;

      const account = await this._accountRepository.findOne({
        where: { phonenumber: phoneNumber },
      });

      if (!account) {
        return AppResponse.setUserErrorResponse<OTPResDto>(
          ErrorHandler.notFound(`The phone number ${phoneNumber}`),
        );
      }

      const getOTP = await this.generateOtp();
      const message = `Your OTP is: ${getOTP}`;
      await this.twilioService.client.messages.create({
        to: `whatsapp:${formatPhoneNumber}`,
        from: this.configService.get<string>('TWILIO_SENDER_SANDBOX'),
        messagingServiceSid: this.configService.get<string>(
          'TWILIO_VERIFICATION_SERVICE_SID',
        ),
        body: message,
      });

      return AppResponse.setSuccessResponse({
        message: 'OTP sent successfully!',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async verifyOtp(otp: string, phonenumber: string): Promise<VerifyOTPResDto> {
    try {
      const account = await this._accountRepository.findOne({
        where: { phonenumber: phonenumber },
      });

      if (!account) {
        return AppResponse.setUserErrorResponse<OTPResDto>(
          ErrorHandler.notFound(`The phone number ${phonenumber}`),
        );
      }

      const otpBody = JSON.stringify(otp);
      const jsonData = JSON.parse(otpBody);
      const otpValue = jsonData.otp;
      const isValidOtp = await speakeasy.totp.verify({
        secret: this.otpSecret,
        encoding: 'base32',
        token: otpValue,
        window: 1,
      });

      if (!isValidOtp) {
        return AppResponse.setUserErrorResponse<VerifyOTPResDto>(
          ErrorHandler.invalid('The OTP'),
          {
            data: {
              valid: isValidOtp,
              status: 'rejected',
            },
          },
        );
      }

      const confirmOtp = await this._accountRepository
        .createQueryBuilder()
        .update(Account)
        .set({
          isValidOtp: true,
        })
        .where('phonenumber = :phonenumber', { phonenumber: phonenumber })
        .execute();

      return AppResponse.setSuccessResponse<VerifyOTPResDto>({
        valid: isValidOtp,
        status: 'approved',
        accountId: confirmOtp.affected,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<VerifyOTPResDto>(error.message);
    }
  }

  async verifyOtpCode(phonenumber: string, otp: string): Promise<OTPResDto> {
    try {
      const account = await this._accountRepository.findOne({
        where: { phonenumber: phonenumber },
      });

      if (!account) {
        return AppResponse.setUserErrorResponse<OTPResDto>(
          ErrorHandler.notFound(`The phone number ${phonenumber}`),
        );
      }
      const otpBody = JSON.stringify(otp);
      const jsonData = JSON.parse(otpBody);
      const otpValue = jsonData.otp;

      const defaultOtp = this.configService.get<string>('OTP_CODE');
      if (otpValue === defaultOtp) {
        const confirmOtp = await this._accountRepository
          .createQueryBuilder()
          .update(Account)
          .set({
            isValidOtp: true,
          })
          .where('phonenumber = :phonenumber', { phonenumber: phonenumber })
          .execute();

        return AppResponse.setSuccessResponse<VerifyOTPResDto>({
          status: 'approved',
          accountId: confirmOtp.affected,
        });
      }

      return AppResponse.setUserErrorResponse<OTPResDto>(
        ErrorHandler.invalid('The OTP'),
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<VerifyOTPResDto>(error.message);
    }
  }
}
