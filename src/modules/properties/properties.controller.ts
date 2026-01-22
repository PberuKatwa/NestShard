import { Body, Controller, Inject, Post, Req, Res, Get, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import type { AppLogger } from "src/logger/winston.logger";
import { APP_LOGGER } from "src/logger/logger.provider";
import { UsersModel } from "../users/users.model";
import type { ApiResponse } from "src/types/api.types";
import { AuthGuard } from "../auth/guards/auth.guard";


@Controller('properties')
