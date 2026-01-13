import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";

@Controller()
export class DemoController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("admin/ping")
  pingAdmin() {
    return { ok: true, scope: "admin" };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("order.read")
  @Get("orders/ping")
  pingOrders() {
    return { ok: true, scope: "order.read" };
  }
}