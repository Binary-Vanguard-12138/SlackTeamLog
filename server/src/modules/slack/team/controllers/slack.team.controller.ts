import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Response
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SlackTeamService } from '../services/slack.team.service';

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
    async getAccessLogs(@Response() response) {
        const data = await this.slackTeamService.getAccessLogs();
        // Send the data as a file stream
        response.setHeader('Content-Type', 'application/octet-stream');
        response.setHeader('Content-Disposition', 'attachment; filename="accessLogs.txt"');
        data.pipe(response);
    }
}
