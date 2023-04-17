import axios from "axios";

class ApiSlackTeamService {
    async getSlackTeamAccessLogsData(token, selectedFile) {
        // Call the backend API
        let response;
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            response = await axios.post("api/slack/teams/accessLogsByUserId", formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
        } else {
            response = await axios.get("api/slack/teams/accessLogs", {
                headers: { Authorization: `Bearer ${token}` },
            });
        }


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