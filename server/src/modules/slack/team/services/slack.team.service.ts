import {
    BadRequestException,
    InternalServerErrorException,
    Injectable
} from '@nestjs/common';
import { Readable } from "stream";
import axios, { AxiosResponse } from "axios";
import { json2csv } from '../../../../utils/json2csv';

const LIMIT_PER_CURSOR = 500;

@Injectable()
export class SlackTeamService {
    async getAccessLogs(authHeader: string, stream: Readable): Promise<Readable> {
        const url = "https://slack.com/api/team.accessLogs";
        const headers = {
            Authorization: authHeader,
            'Content-Type': 'application/json'
        };
        let response: AxiosResponse<any> | undefined;
        let next_cursor = undefined;
        let csv_headers = [];
        let total_count = 0;

        while (true) {
            try {
                response = await axios.get(url, {
                    headers,
                    params: {
                        limit: LIMIT_PER_CURSOR,
                        next_cursor
                    }
                });
            } catch (error) {
                throw new InternalServerErrorException(error.message);
            }

            let respData = response.data;
            if (false === respData.ok) {
                throw new BadRequestException(respData.error);
            }

            if (0 === csv_headers.length && 0 < respData.logins.length) {
                // Initialize CSV headers
                csv_headers = Object.keys(respData.logins[0]);
                stream.push(csv_headers.join(',')); // header row first
                stream.push('\r\n');
            }
            stream.push(json2csv(respData.logins, csv_headers));
            total_count += respData.logins.length;
            console.log(`Scraped ${total_count} logins in total`);
            next_cursor = respData.response_metadata.next_cursor;
            if (!next_cursor) {
                break;
            }
        }
        stream.push(null);
        return stream;
    }

    async getAccessLogsByUserId(authHeader: string, userIds: Array<string>, stream: Readable): Promise<Readable> {
        console.log(userIds);
        const url = "https://slack.com/api/team.accessLogs";
        const headers = {
            Authorization: authHeader,
            'Content-Type': 'application/json'
        };
        let response: AxiosResponse<any> | undefined;
        let next_cursor = undefined;
        let csv_headers = [];
        let total_count = 0;

        while (true) {
            try {
                response = await axios.get(url, {
                    headers,
                    params: {
                        limit: LIMIT_PER_CURSOR,
                        next_cursor
                    }
                });
            } catch (error) {
                throw new InternalServerErrorException(error.message);
            }

            let respData = response.data;
            if (false === respData.ok) {
                throw new BadRequestException(respData.error);
            }

            if (0 === csv_headers.length && 0 < respData.logins.length) {
                // Initialize CSV headers
                csv_headers = Object.keys(respData.logins[0]);
                stream.push(csv_headers.join(',')); // header row first
                stream.push('\r\n');
            }
            stream.push(json2csv(respData.logins, csv_headers));
            total_count += respData.logins.length;
            console.log(`Scraped ${total_count} logins in total`);
            next_cursor = respData.response_metadata.next_cursor;
            if (!next_cursor) {
                break;
            }
        }
        stream.push(null);
        return stream;
    }
}

