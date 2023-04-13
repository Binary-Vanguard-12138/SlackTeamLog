import apiSlackTeamService from "../../api/api-slackTeam.service";
import { setErrorSlackTeamAccessLogs, setSlackTeamAccessLogs, setLoadingSlackTeamAccessLogs } from "../reducers/slackTeamReducer";

export const downloadSlackTeamAccessLogs = (token) => async (dispatch) => {
    setErrorSlackTeamAccessLogs(null);
    setLoadingSlackTeamAccessLogs(true);
    try {
        const accessLogsData = await apiSlackTeamService.getSlackTeamAccessLogsData(token);
        setErrorSlackTeamAccessLogs(null);
        setLoadingSlackTeamAccessLogs(false);
        dispatch(setSlackTeamAccessLogs(accessLogsData));
    } catch (error) {
        setErrorSlackTeamAccessLogs(error);
        setLoadingSlackTeamAccessLogs(false);
    }
};