import { plainToInstance } from "class-transformer";
import { IsEnum, IsNumber, Max, Min, validateSync } from "class-validator";

export enum ENVIRONMENT {
  LOCAL = "LOCAL",
  DEVELOP = "DEVELOP",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}

class EnvVariables {
  @IsEnum(ENVIRONMENT)
  NODE_ENV: ENVIRONMENT;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }
  return validatedConfig;
}
