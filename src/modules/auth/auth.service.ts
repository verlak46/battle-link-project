import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { getFirebaseAdmin } from '../../config/firebase-admin.config';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { EmailService } from './email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

export interface AuthResponse {
  token: string;
  user: UserDocument;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private signToken(user: UserDocument): string {
    return this.jwtService.sign({ sub: user._id.toString(), email: user.email });
  }

  async loginGoogle(dto: GoogleAuthDto): Promise<AuthResponse> {
    const decoded = await getFirebaseAdmin().auth().verifyIdToken(dto.token);
    const { uid, email, name, picture } = decoded;

    let user = await this.usersService.findByGoogleId(uid);
    if (!user) {
      user = await this.usersService.createUser({
        googleId: uid,
        email,
        name,
        picture: picture ?? undefined,
        provider: 'google',
      });
    }

    return { token: this.signToken(user), user };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('El email ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashed,
      provider: 'local',
    });

    return { token: this.signToken(user), user };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email, true);
    if (!user?.password) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    user.password = undefined;
    return { token: this.signToken(user), user };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    // Respuesta genérica para no revelar si el email existe
    if (!user || user.provider !== 'local') return;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.usersService.setResetToken(dto.email, token, expires);
    await this.emailService.sendPasswordReset(dto.email, token);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.usersService.findByResetToken(dto.token);
    if (!user) throw new BadRequestException('El enlace de recuperación es inválido o ha expirado');

    const hashed = await bcrypt.hash(dto.password, 10);
    await this.usersService.updatePassword(user._id.toString(), hashed);
  }
}
