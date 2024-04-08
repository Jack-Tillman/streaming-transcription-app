import "../styles/home.css";
import AudioTranscription from "../components/AudioTranscription";

export const Home = () => {
  return (
    <>
      <AudioTranscription />
      {/* <div className="response-container" id="response-container">
        <span className="response-div" id="gpt-response"></span>
        <span className="response-div" id="json-response"></span>
        <span className="response-div" id="better-response"></span>
        <span className="response-div" id="ehr-response"></span>
      </div>
      <div className="button-container">
        <button
          className="info-button reformat-button"
          id="reformat-button"
          target="_blank"
        >
          Make Report
        </button>
        <button
          className="info-button json-button"
          id="json-button"
          target="_blank"
        >
          Make JSON
        </button>
        <button
          className="info-button ehr-button"
          id="ehr-button"
          target="_blank"
        >
          Insert ehr
        </button>
      </div> */}
    </>
  );
};
