import axios from "axios";

class ApiSlackTeamService {
    async getSlackTeamAccessLogsData(token) {
        // Call the backend API
        const response = await axios.get("api/slack/teams/accessLogs", {
            headers: { Authorization: `Bearer ${token}` },
        });


        const contentDisposition = response.headers["content-disposition"];
        const filenameMatch = contentDisposition.match(/filename="?(.+)"$/);
        const filename = filenameMatch ? filenameMatch[1] : "file.txt";

        return {
            data: response.data,
            filename,
        };
    }
}

const apiSlackTeamService = new ApiSlackTeamService();
export default apiSlackTeamService;