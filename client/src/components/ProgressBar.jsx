import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "../styles/app.css";


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel({ progress, isLoading }) {

  const getTextForProgress = (progress) => {
    if (progress < 25 && isLoading) {
      return "Making your report now...";
    } else if ((25 < progress < 51) && isLoading) {
      return "Converting report into appropriate file type...";
    } else if ((51 < progress < 76) && isLoading) {
      return "Inserting report into the database...";
    } else if ((76 < progress < 101) && isLoading) {
      return "Insertion complete!";
    } else {
      return "";
    }
  };

  const progressText = getTextForProgress(progress);
  const shouldDisplayProgress = progress > 0 && progress <= 100;

  return (
    <Box sx={{ width: '60%', margin: "0 auto", padding: "1rem" }}>
      {shouldDisplayProgress && (
        <>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            {progressText}
          </Typography>
          <LinearProgressWithLabel value={progress} sx={{height: "2rem", border:"0.25rem inset azure", backgroundColor: "azure"}}/>
        </>
      )}
    </Box>
  );
}

LinearWithValueLabel.propTypes = {
  progress: PropTypes.number.isRequired,
};