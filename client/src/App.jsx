import React, { useState } from "react";
import { Home } from "./views/Home";
import RecentInsertionPage from "./views/RecentInsertionPage";
import { LoadingProvider } from "./contexts/LoadingContext";
import AudioTranscription from "./components/AudioTranscription";
import LinearWithValueLabel from "./components/ProgressBar";

const App = () => {
  const [databaseEntry, setDatabaseEntry] = useState(null);
  const [showRecord, setShowRecord] = useState(true);
  const [captions, setCaptions] = useState("");
  const [fullTranscription, setFullTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);


  const [progress, setProgress] = useState(0);
  const totalSteps = 4;
  const increment = 100 / totalSteps;

  const handleProgress = async () => {
    setProgress(prevProgress => prevProgress + increment);
  };

  return (
    <>
      <LoadingProvider>
        {databaseEntry ? (
          <RecentInsertionPage databaseEntry={databaseEntry} handleProgress={handleProgress} />
        ) : (
          <Home
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            captions={captions}
            setCaptions={setCaptions}
            fullTranscription={fullTranscription}
            setFullTranscription={setFullTranscription}
            showRecord={showRecord}
            setShowRecord={setShowRecord}
            databaseEntry={databaseEntry}
            setDatabaseEntry={setDatabaseEntry}
            showCaptions={showCaptions}
            setShowCaptions={setShowCaptions}
            handleProgress={handleProgress}
          />
        )}
          <AudioTranscription
          captions={captions}
          setCaptions={setCaptions}
          fullTranscription={fullTranscription}
          setFullTranscription={setFullTranscription}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          showCaptions={showCaptions}
          setShowCaptions={setShowCaptions}
          showRecord={showRecord}
          setShowRecord={setShowRecord}
          handleProgress={handleProgress}
        />
        <LinearWithValueLabel progress={progress}/>
      </LoadingProvider>
    </>
  );
};

export default App;
