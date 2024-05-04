export default function Card({ captions, fullTranscription }) {
    return (
      <>
        <div className="card-container">
          <div className="card shadow">
            <p className="caption-card">
              {" "}
              {captions ? captions : "Your speech shows up here"}
            </p>
            <hr
              style={{
                border: "1px solid grey",
                margin: "1rem",
                width: "65%",
                opacity: "0.2",
              }}
            ></hr>
  
            <p className="transcription-card">
              {fullTranscription
                ? fullTranscription
                : "Your full transcription appears here"}
            </p>
          </div>
        </div>
      </>
    );
  }
  