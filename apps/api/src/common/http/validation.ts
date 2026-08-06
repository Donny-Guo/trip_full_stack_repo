import { ValidationPipe } from "@nestjs/common";
import { validationExceptionFactory } from "./api-exception.js";

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: false,
    validationError: { target: false, value: false },
    exceptionFactory: validationExceptionFactory,
  });
}
