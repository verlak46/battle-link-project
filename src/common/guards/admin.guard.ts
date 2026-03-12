import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../../modules/users/users.service';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = await this.usersService.findById(request.user.sub);
    if (!user.isAdmin) throw new ForbiddenException('Se requieren permisos de administrador');
    return true;
  }
}
