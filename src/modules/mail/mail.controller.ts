import { Controller, Post, Req } from "@nestjs/common";
import { MailService } from "./mail.service";
import type { Request, Response } from "express";

@Controller("mail")
export class MailController{

  constructor(private readonly mailService: MailService) { }

  @Post()
  async sendTestEmail(@Req() req:Request, ) {

  }

}
