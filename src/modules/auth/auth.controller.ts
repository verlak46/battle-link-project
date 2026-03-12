import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login con Google (Firebase ID token)' })
  @ApiResponse({ status: 200, description: 'Login exitoso. Devuelve JWT y datos del usuario.' })
  @ApiResponse({ status: 401, description: 'Token de Firebase inválido o expirado.' })
  loginGoogle(@Body() dto: GoogleAuthDto) {
    return this.authService.loginGoogle(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario con email y contraseña' })
  @ApiResponse({ status: 201, description: 'Usuario registrado. Devuelve JWT y datos del usuario.' })
  @ApiResponse({ status: 400, description: 'El email ya está registrado.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login con email y contraseña' })
  @ApiResponse({ status: 200, description: 'Login exitoso. Devuelve JWT y datos del usuario.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar email de recuperación de contraseña' })
  @ApiResponse({ status: 200, description: 'Si el email existe, se enviará un enlace de recuperación.' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con token del email' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada correctamente.' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado.' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
