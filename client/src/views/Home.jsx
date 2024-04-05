import '../styles/home.css'

export const Home = () => {
  return (
    <>
      <div className="captions" id="captions">
        <span id="realtime-caption">Your speech shows up here</span>
      </div>
      <div className="full-transcription">
        <h2 id="left-h2">Full Transcription Below</h2>
        <span className="full-transcription" id="full-transcription"></span>
      </div>
      <div className="response-container" id="response-container">
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
        <button className="info-button ehr-button" id="ehr-button" target="_blank">
          Insert ehr
        </button>
      </div>
      <div className="content">
        <div className="button-container">
          <input type="checkbox" id="record" className="mic-checkbox" />
          <label htmlFor="record" className="mic-button">
            <div className="mic">
              <div className="mic-button-loader"></div>
              <div className="mic-base"></div>
            </div>
            <div className="button-message">
              <span>&nbsp;</span>
              <span> START </span>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};
