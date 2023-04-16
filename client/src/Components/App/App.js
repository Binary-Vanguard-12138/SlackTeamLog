import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Button, TextField, Typography } from '@mui/material';
import { downloadSlackTeamAccessLogs } from '../../redux/actions/slackTeamAction';
import { connect } from "react-redux";

import './App.css';
import { setSlackTeamAccessLogs } from '../../redux/reducers/slackTeamReducer';

function App({ data, filename, loading, error }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState('');

  const handleClickSaveButton = async (event) => {
    dispatch(downloadSlackTeamAccessLogs(token));
  }

  useEffect(() => {
    if (data && filename && !loading) {
      // Save the response as a file
      const file = new Blob([data], { type: "text/plain" });
      const fileUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      dispatch(setSlackTeamAccessLogs({ data: null, filename: null }));
    }
  }, [dispatch, data, filename, loading]);

  return (
    <div className="App">
      <Typography variant='h3' py={4}>Slack Team Access Log Downloader</Typography>
      <Typography py={2}>Please input your user token for Slack application</Typography>
      <TextField py={2} label="Token" value={token} onChange={e => { setToken(e.target.value) }} />
      <Typography />
      <Button sx={{ my: 2 }} variant="contained" color="primary" onClick={handleClickSaveButton} disabled={loading} >
        Save
      </Button>
      {filename ? (<Typography>File has been saved to {filename}</Typography>) : (<></>)}
      {error ? (<Typography color={"error"}>{error}</Typography>) : (<></>)}
    </div>
  );
}

const mapStatetoProps = state => {
  return {
    data: state.slackTeam.data,
    filename: state.slackTeam.filename,
    loading: state.slackTeam.loading,
    error: state.slackTeam.error,
  };
};

export default connect(mapStatetoProps, { downloadSlackTeamAccessLogs })(App);
