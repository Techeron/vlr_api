import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get('/')
  api() {
    return {
      msg: 'wip',
      types: ['events', 'players'],
    };
  }
}
