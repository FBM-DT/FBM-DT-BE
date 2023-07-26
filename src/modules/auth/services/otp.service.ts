import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class OtpService {
  constructor(private readonly twilioService: TwilioService) {}

  async sendOtp(phoneNumber?: string, otp?: string): Promise<void> {
    try {
      const from = '+12187488035';

      const message = `Your OTP is: ${otp}`;

      await this.twilioService.client.messages.create({
        to: '+840961135481',
        from,
        messagingServiceSid: 'MG5a9d7905b30dddeba7bee57204f844c8',
        body: message,
      });
    } catch (error) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }
}
