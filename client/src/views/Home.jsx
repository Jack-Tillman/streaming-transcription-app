import "../styles/home.css";
import AudioTranscription from "../components/AudioTranscription";
// import TranscriptionProcessor from "../components/TranscriptionProcessor";
import InsertData from "../components/InsertData";
import { useState } from "react";
import { ShowJson } from "../components/ShowJson";
import { ShowReport } from "../components/ShowReport";
import TranscriptionForm from "../components/TranscriptionForm";
import ReportForm from "../components/ReportForm";
import Loading from "../components/Loading";
import { useLoading } from "../contexts/LoadingContext";

// import RecentInsertionPage from "./RecentInsertionPage";

export const Home = ({databaseEntry, setDatabaseEntry}) => {
  const [captions, setCaptions] = useState("");
  const [fullTranscription, setFullTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showRecord, setShowRecord] = useState(true);
  const [report, setReport] = useState("");
  const [json, setJson] = useState("");
  const [showCaptions, setShowCaptions] = useState(true);
  const { setLoading } = useLoading();

  return (
    <>
      <div id="home-container">
        {/* until a report is made, show captions and transcription */}
        {!report && showCaptions ? (
          <>
            <div className="captions" id="captions">
              <span id="realtime-caption">
                {captions ? captions : "Your speech shows up here"}
              </span>
            </div>
            <div className="full-transcription">
              <h2 id="left-h2">Full transcription Below</h2>
              <span id="full-transcription">{fullTranscription}</span>
            </div>
          </>
        ) : null}
        {/* user has recorded transcription and reformatted it, show form of their transcription */}
        {fullTranscription && !isRecording && !report ? (
          <TranscriptionForm
            fullTranscription={fullTranscription}
            setReport={setReport}
            setShowRecord={setShowRecord}
            showRecord={showRecord}
          />
        ) : null}

        {/* after user makes report, render second form so they can edit the report */}
        {report && !isRecording ? (
          <ReportForm report={report} setJson={setJson} json={json} databaseEntry={databaseEntry} setDatabaseEntry={setDatabaseEntry} />
        ) : null}

        <span id="response-containers" className="response-container">
        </span>

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
        />

        {/* {json && <InsertData json={json} />} */}
      </div>
    </>
  );
};
