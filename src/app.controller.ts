import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Controller: App(root)
 */
@Controller()
@ApiTags('App')
export class AppController {
  /**
   * Logger instance
   * @private
   */
  private readonly logger = new Logger(AppController.name);

  /**
   * Constructor
   * @param appService  Injected instance of AuthService
   */
  constructor(private readonly appService: AppService) {}

  /**
   * GET /v1/
   */
  @Get()
  @ApiOperation({
    summary: 'Hello',
    description: '백엔드의 동작 여부를 확인하기 위한 간단한 요청으로 사용한다.',
  })
  @ApiOkResponse({
    description: '정상',
  })
  getHello() {
    this.logger.log(`GET /v1/`);
    return this.appService.getHello();
  }
}
