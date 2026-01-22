import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolePermission } from 'src/entities/role-permission.entity';
import { User } from 'src/entities/users.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { RefreshToken } from 'src/entities/refreshtoken.entity';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,

    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(Role) private readonly roles: Repository<Role>,

    @InjectRepository(UserRole)
    private readonly userRoles: Repository<UserRole>,

    @InjectRepository(RolePermission)
    private readonly rolePerms: Repository<RolePermission>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
  ) {}

  async register(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    // TODO: check if email exists
    const existing = await this.users.findOne({ where: { email } });
    if (existing) throw new UnauthorizedException('User already exists');
    // TODO: create user
    const user = this.users.create({ email, passwordHash });
    const savedUser = await this.users.save(user);
    // TODO: attach default role "user" in user_roles
    let role = await this.roles.findOneBy({ name: 'user' });

    if (!role) {
      role = await this.roles.save({ name: 'user' });
    }

    await this.userRoles.save({
      user: savedUser,
      role: role,
    });
    return { message: 'registered', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Fetch roles
    const roles = await this.userRoles.find({
      where: { user: { id: user.id } },
      relations: { role: true, user: true },
    });
    const roleNames = roles.map((r) => r.role.name);

    // Fetch permissions via roles
    const roleIds = roles.map((r) => r.role.id);
    const perms = await this.rolePerms
      .createQueryBuilder('rp')
      .leftJoinAndSelect('rp.permission', 'permission')
      .where('rp.roleId IN (:...roleIds)', { roleIds })
      .getMany();

    const permissionKeys = [...new Set(perms.map((x) => x.permission.key))];

    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES as any) ?? '15m',
      },
    );

    const refreshToken = randomBytes(48).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // TODO: store refresh token hash
    // expiresAt should be computed (ex: now + 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokens.save({
      tokenHash: refreshTokenHash,
      user: user,
      expiresAt: expiresAt,
    });

    return { accessToken, refreshToken };
  }
}
