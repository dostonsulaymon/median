// src/prisma-client-exception.filter.ts

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        // Unique constraint violation (e.g., trying to insert a duplicate entry)
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `Unique constraint violation: ${message}`,
        });
        break;
      }
      case 'P2003': {
        // Foreign key constraint violation (e.g., trying to reference a non-existing record)
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message: `Foreign key violation: ${message}`,
        });
        break;
      }
      case 'P2025': {
        // Record not found (e.g., trying to update or delete a record that doesn't exist)
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: `Record not found: ${message}`,
        });
        break;
      }
      case 'P2016': {
        // Invalid `select` or `include` arguments (e.g., selecting non-existent fields)
        const status = HttpStatus.BAD_REQUEST;
        response.status(status).json({
          statusCode: status,
          message: `Invalid query parameters: ${message}`,
        });
        break;
      }
      case 'P2018': {
        // Query failure due to a connection error or database issue
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: `Database connection error: ${message}`,
        });
        break;
      }
      default:
        // Fallback for other Prisma errors, return a generic 500 error
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
          statusCode: status,
          message: `An unexpected error occurred: ${message}`,
        });
        break;
    }
  }
}
