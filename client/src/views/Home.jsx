import "../styles/home.css";
import AudioTranscription from "../components/AudioTranscription";
import TranscriptionProcessor from "../components/TranscriptionProcessor";
import InsertData from "../components/InsertData";
import { useState } from "react";
import { ShowJson } from "../components/ShowJson";
import { ShowReport } from "../components/ShowReport";

export const Home = () => {
  const [captions, setCaptions] = useState("");
  const [fullTranscription, setFullTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [report, setReport] = useState("");
  const [json, setJson] = useState("");
  return (
    <>
      <div id="home-container">
        {!report ? (
          <>
            <div className="captions" id="captions">
              <span id="realtime-caption">
                {captions ? captions : "Your speech shows up here"}
              </span>
            </div>
            <div className="full-transcription">
              <h2 id="left-h2">Full transcription Below</h2>
              <span className="full-transcription" id="full-transcription">
                {fullTranscription}
              </span>
            </div>
          </>
        ) : null}

        <span id="response-containers" className="response-container">
          {report ? <ShowReport report={report} /> : null}
          {json ? <ShowJson json={json} /> : null}
        </span>
        <AudioTranscription
          captions={captions}
          setCaptions={setCaptions}
          fullTranscription={fullTranscription}
          setFullTranscription={setFullTranscription}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />

        {fullTranscription ? (
          <TranscriptionProcessor
            fullTranscription={fullTranscription}
            report={report}
            json={json}
            setJson={setJson}
            setReport={setReport}
          />
        ) : null}
        {json && <InsertData json={json} />}
      </div>
    </>
  );
};
