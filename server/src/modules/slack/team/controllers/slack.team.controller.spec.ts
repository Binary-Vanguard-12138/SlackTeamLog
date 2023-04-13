import { Test, TestingModule } from '@nestjs/testing';
import { SlackTeamController } from './slack.team.controller';
import { SlackTeamService } from '../services/slack.team.service';

describe('SlackTeamController', () => {
  let slackTeamController: SlackTeamController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SlackTeamController],
      providers: [SlackTeamService],
    }).compile();

    slackTeamController = app.get<SlackTeamController>(SlackTeamController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(slackTeamController.getAccessLogs()).toBe('Hello World!');
    });
  });
});
