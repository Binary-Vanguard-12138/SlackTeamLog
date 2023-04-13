import { Injectable } from '@nestjs/common';
import { Readable } from "stream";

@Injectable()
export class SlackTeamService {
    async getAccessLogs(): Promise<Readable> {
        const url = "https://some/api";
        return new Readable({
            read() {
                this.push("data123");
                this.push(null);
            },
        });
    }
}
