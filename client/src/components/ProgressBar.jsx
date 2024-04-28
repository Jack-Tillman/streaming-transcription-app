import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import "../styles/app.css"


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography  variant="body" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel({ progress }) {
  const [hide, setHide] = React.useState(true);

  React.useEffect(() => {
    if (progress > 0 && progress !== 100) {
      const timer = setTimeout(() => {
        setHide(false);
      }, 1);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <Box sx={{ width: '60%', margin: "0 auto", padding: "1rem" }}>
      {!hide && <LinearProgressWithLabel value={progress} sx={{height: "2rem", border:"0.25rem inset azure", backgroundColor: "azure"}}/>}
    </Box>
  );
}

LinearWithValueLabel.propTypes = {
  progress: PropTypes.number.isRequired,
};