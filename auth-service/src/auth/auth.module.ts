import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/entities/users.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { RefreshToken } from 'src/entities/refreshtoken.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { DemoController } from './authorizationdemocontroller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, UserRole, RolePermission, RefreshToken]),
    JwtModule.register({
    }),
  ],
  controllers: [AuthController, DemoController],
  providers: [AuthService, JwtStrategy, RolePermission, RolesGuard]
})
export class AuthModule {}
