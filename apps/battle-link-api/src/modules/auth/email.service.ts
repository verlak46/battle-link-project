import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress: string;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.fromAddress = this.config.get<string>('EMAIL_FROM')!;
    this.frontendUrl = this.config.get<string>('FRONTEND_URL')!;
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to: email,
      subject: 'Recuperación de contraseña – Battle Link',
      html: this.buildResetEmail(resetUrl),
    });

    if (error) {
      this.logger.error('Error enviando email de recuperación', error);
      throw new InternalServerErrorException('No se pudo enviar el email de recuperación');
    }
  }

  private buildResetEmail(resetUrl: string): string {
    return `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a2e;">Recuperar contraseña</h2>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Battle Link.</p>
        <p>Haz clic en el botón para crear una nueva contraseña. El enlace expira en <strong>1 hora</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:24px 0;padding:12px 28px;background:#6c63ff;color:#fff;
                  border-radius:8px;text-decoration:none;font-weight:600;">
          Restablecer contraseña
        </a>
        <p style="color:#888;font-size:13px;">
          Si no solicitaste este cambio, puedes ignorar este email.<br>
          El enlace dejará de funcionar en 1 hora.
        </p>
      </div>
    `;
  }
}
