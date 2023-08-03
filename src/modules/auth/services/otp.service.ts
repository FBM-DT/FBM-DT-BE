import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { TwilioService } from 'nestjs-twilio';
import { OTPResDto, VerifyOTPResDto } from '../dto/response';
import { Twilio } from 'twilio';
import { AppResponse } from '../../../core/shared/app.response';
import * as speakeasy from 'speakeasy';
import { ErrorHandler } from '../../../core/shared/common/error';
import { Account } from '../account.entity';
import { TYPEORM } from '../../../core/constants';

@Injectable()
export class OtpService {
  private twilioClient: Twilio;
  private readonly otpSecret: string;
  private _dataSource: DataSource;
  private _accountRepository: Repository<Account>;
  constructor(
    @Inject(TYPEORM) dataSource: DataSource,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
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

      // const digits = '0123456789';
      // let OTP = '';
      // for (let i = 0; i < 6; i++) {
      //   OTP += digits[Math.floor(Math.random() * 10)];
      // }

      const getOtp = await this.generateOtp();
      console.log(getOtp);
      const message = `Your OTP is: ${getOtp}`;
      await this.twilioService.client.messages.create({
        to: formatPhoneNumber,
        from: '+12187488035',
        messagingServiceSid: 'MG5a9d7905b30dddeba7bee57204f844c8',
        body: message,
      });

      const response: OTPResDto = AppResponse.setSuccessResponse({
        message: 'OTP sent successfully!',
      });
      return response;
    } catch (error) {
      const response: OTPResDto = AppResponse.setAppErrorResponse(
        error.message,
      );
      return response;
    }
  }

  // async OtpVerification(phonenumber: string, verificationCode: string) {
  //   try {
  //     const serviceSid = this.configService.get(
  //       'TWILIO_VERIFICATION_SERVICE_SID',
  //     );
  //     console.log(serviceSid);
  //     const param = JSON.stringify(phonenumber);
  //     const jsonData = JSON.parse(param);
  //     const phoneNumber = jsonData.phonenumber;
  //     const formatPhoneNumber = `+84${phoneNumber}`;
  //     console.log(formatPhoneNumber);

  //     const result = await this.twilioClient.verify.v2
  //       .services(serviceSid)
  //       .verificationChecks.create({
  //         to: formatPhoneNumber,
  //         code: verificationCode,
  //       })
  //       .then((verification) => console.log(verification.status));
  //     console.log('result', result);

  //     // if (!result.valid || result.status !== 'approved') {
  //     //   console.log('Code not');
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async verifyOtp(otp: string, phonenumber: string): Promise<VerifyOTPResDto> {
    try {
      const otpBody = JSON.stringify(otp);
      console.log('body', otpBody);
      const jsonData = JSON.parse(otpBody);
      console.log('data', jsonData);
      const otpValue = jsonData.otp;
      console.log('value', otpValue);
      const otpIsValid = await speakeasy.totp.verify({
        secret: this.otpSecret,
        encoding: 'base32',
        token: otpValue,
        window: 1,
      });
      console.log(otpIsValid);

      if (!otpIsValid) {
        const response: VerifyOTPResDto =
          AppResponse.setUserErrorResponse<VerifyOTPResDto>(
            ErrorHandler.invalid('The OTP'),
            {
              data: {
                valid: otpIsValid,
                status: 'rejected',
              },
            },
          );
        return response;
      } else {
        const confirmOtp = await this._accountRepository
          .createQueryBuilder()
          .update(Account)
          .set({
            isValidOtp: true,
          })
          .where('phonenumber = :phonenumber', { phonenumber: phonenumber })
          .execute();
        console.log('confirm', confirmOtp);

        const response: VerifyOTPResDto =
          AppResponse.setSuccessResponse<VerifyOTPResDto>({
            valid: otpIsValid,
            status: 'approved',
            accountId: confirmOtp.affected,
          });
        return response;
      }
    } catch (error) {
      const response: VerifyOTPResDto =
        AppResponse.setAppErrorResponse<VerifyOTPResDto>(error.message);
      return response;
    }
  }
}
