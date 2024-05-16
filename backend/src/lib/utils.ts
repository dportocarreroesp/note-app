import { JwtPayload } from 'src/types';
import { Request } from 'express';

export function getJwtPayload(request: Request): JwtPayload {
  return (request as any).user;
}
