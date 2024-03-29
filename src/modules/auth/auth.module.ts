import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/strategies/jwt.strategy";
import { ConfigService, ConfigType } from "@nestjs/config";
import jwtConfig from "src/config/jwt.config";

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        const jwt: ConfigType<typeof jwtConfig> = configService.get("jwt");
        console.log("config service", jwt.jwt_secret);

        return {
          global: true,
          secret: jwt.jwt_secret,
          signOptions: { expiresIn: "1d" },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
