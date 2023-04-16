import {
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Response
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SlackTeamService } from '../services/slack.team.service';
import { Readable } from "stream";

@Controller('api/slack/teams')
@ApiTags('api/slack/teams')
export class SlackTeamController {
    constructor(private readonly slackTeamService: SlackTeamService) { }

    @Get('/accessLogs')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Get access logs of Slack teams",
    })
    async getAccessLogs(@Headers() headers, @Response() response) {
        const authHeader = headers.authorization;
        const stream = new Readable();
        stream._read = () => { };
        // Send the data as a file stream
        response.setHeader('Content-Type', 'application/octet-stream');
        response.setHeader('Content-Disposition', 'attachment; filename="accessLogs.csv"');
        stream.pipe(response);
        await this.slackTeamService.getAccessLogs(authHeader, stream);
    }
}
