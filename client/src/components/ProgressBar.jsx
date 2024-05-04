import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useLoading } from '../contexts/LoadingContext';
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

export default function LinearWithValueLabel({ progress }) {
  const { isLoading } = useLoading();

  const getTextForProgress = (progress) => {
    if (progress === 25) {
      return "Making your report now...";
    } else if (progress === 50) {
      return "Converting report into appropriate file type...";
    } else if (progress === 75) {
      return "Inserting report into the database...";
    } else if (progress === 100) {
      return "Insertion complete!";
    } else {
      return "";
    }
  };

  const progressText = getTextForProgress(progress);
  const shouldDisplayProgress = isLoading && progress > 0 && progress <= 100;

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