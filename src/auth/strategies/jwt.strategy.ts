import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Define a proper interface for the JWT payload
interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Define the user object that will be attached to the request
interface ValidatedUser {
  userId: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'YOUR_JWT_SECRET', // later move to config service
    });
  }

  validate(payload: JwtPayload): ValidatedUser {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
