import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class OtpService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtp(phonenumber: string): Promise<void> {
    try {
      console.log('step 1');
      const param = JSON.stringify(phonenumber);
      const jsonData = JSON.parse(param);
      const phoneNumber = jsonData.phonenumber;
      const formatPhoneNumber = `+84${phoneNumber}`;

      const digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }

      const message = `Your OTP is: ${OTP}`;
      console.log('step 2');
      await this.twilioService.client.messages.create({
        to: formatPhoneNumber,
        from: '+12187488035',
        messagingServiceSid: 'MG5a9d7905b30dddeba7bee57204f844c8',
        body: message,
      });
    } catch (error) {
      throw new Error(`Failed to send OTP: ${error}`);
    }
  }
}
