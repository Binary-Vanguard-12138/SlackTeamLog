import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { SlackTeamService } from '../services/slack.team.service';

@Controller('api/slack/teams')
@ApiTags('api/slack/teams')
export class SlackTeamController {
  constructor(private readonly slackTeamService: SlackTeamService) {}

  @Get('/accessLogs')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get access logs of Slack teams',
  })
  async getAccessLogs(
    @Headers() headers,
    @Query() queryParams,
    @Response() response,
  ) {
    const authHeader = headers.authorization;
    const stream = new Readable();
    let maxPage = 0;
    if (queryParams && 'maxPage' in queryParams) {
      maxPage = queryParams.maxPage;
    }

    stream._read = () => {};
    // Send the data as a file stream
    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="accessLogs.csv"',
    );
    stream.pipe(response);
    await this.slackTeamService.getAccessLogs(authHeader, maxPage, stream);
  }

  @Post('/accessLogsByUserId')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get access logs of Slack teams by User Ids',
  })
  async getAccessLogsByUserId(
    @Body() body,
    @Headers() headers,
    @UploadedFile() file,
    @Response() response,
  ) {
    const authHeader = headers.authorization;
    const stream = new Readable();
    const maxPage = 0 < body.maxPage ? body.maxPage : 0;
    const userIds = file.buffer
      .toString('utf-8')
      .split(',')
      .map((uid: string) => uid.trim());
    stream._read = () => {};
    // Send the data as a file stream
    response.setHeader('Content-Type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="accessLogsByUserId.csv"',
    );
    stream.pipe(response);
    await this.slackTeamService.getAccessLogsByUserId(
      authHeader,
      userIds,
      maxPage,
      stream,
    );
  }
}
