import "../styles/home.css";
import { useState } from "react";
import TranscriptionForm from "../components/TranscriptionForm";
import ReportForm from "../components/ReportForm";
import Loading from "../components/Loading";
import { useLoading } from "../contexts/LoadingContext";
import OutlinedCard from "../components/Card";
export const Home = ({
  databaseEntry,
  setDatabaseEntry,
  showCaptions,
  setShowCaptions,
  showRecord,
  setShowRecord,
  isRecording,
  setIsRecording,
  captions,
  setCaptions,
  fullTranscription,
  setFullTranscription,
  handleProgress,
}) => {
  const [report, setReport] = useState("");
  const [json, setJson] = useState("");
  const { setLoading } = useLoading();

  return (
    <>
      <div id="home-container">
        {/* until a report is made, show captions and transcription */}
        {!report && showCaptions ? (
          <>
            <OutlinedCard captions={captions} fullTranscription={fullTranscription}/>
           
          </>
        ) : null}
        {/* user has recorded transcription and reformatted it, show form of their transcription */}
        {fullTranscription && !isRecording && !report ? (
          <TranscriptionForm
            fullTranscription={fullTranscription}
            setReport={setReport}
            setShowRecord={setShowRecord}
            showRecord={showRecord}
            handleProgress={handleProgress}
          />
        ) : null}

        {/* after user makes report, render second form so they can edit the report */}
        {report && !isRecording ? (
          <ReportForm
            report={report}
            setJson={setJson}
            json={json}
            databaseEntry={databaseEntry}
            setDatabaseEntry={setDatabaseEntry}
            handleProgress={handleProgress}
          />
        ) : null}

        <span id="response-containers" className="response-container"></span>
      </div>
    </>
  );
};
