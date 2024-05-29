import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  kemChho(): string {
    return "Majama!";
  }
}
