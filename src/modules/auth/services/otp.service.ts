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

      await this.twilioService.client.messages.create({
        to: formatPhoneNumber,
        from: this.configService.get<string>('TWILIO_SENDER_PHONE_NUMBER'),
        messagingServiceSid: this.configService.get<string>(
          'TWILIO_VERIFICATION_SERVICE_SID',
        ),
        body: message,
      });
    } catch (error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }
}
