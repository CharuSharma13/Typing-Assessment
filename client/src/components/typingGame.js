import { useState } from "react";
import "../css/typingGame.css";
import TypingBox from "./TypingBox";
import Stats from "./Stats";
import Turtle from "../images/turtle.svg";
import Trex from "../images/dino.svg";
import Octopus from "../images/octopus.svg";
import useWindowDimensions from "../utilities/utilities";
import axios from "axios";
import { useEffect } from "react";

const App = ({ userData }) => {
  const [wordCount, setWordCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [timer, setTimer] = useState(60);
  const [open, setOpen] = useState(false);
  const [restart, setRestart] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const saveData = async () => {
      if (userData && open) {
        const data = {
          user_id: userData.user_id,
          email: userData.email,
          chars_per_min: charCount,
          accuracy_percent: accuracy,
        };
        await axios
          .post(`${process.env.REACT_APP_SERVER_URL}/v1/game/info`, data)
          .catch((error) => {
            console.log(error);
          });
      }
    };
    saveData();
  }, [open, userData, charCount, accuracy]);

  const getIdentity = () => {
    if (wordCount <= 30) {
      return "Turtle";
    } else if (wordCount > 30 && wordCount <= 46) {
      return "T-rex";
    } else {
      return "Octopus";
    }
  };
  const getImage = () => {
    if (wordCount <= 30) {
      return Turtle;
    } else if (wordCount > 30 && wordCount <= 46) {
      return Trex;
    } else {
      return Octopus;
    }
  };

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="App">
        <div
          className="timer-bar"
          style={{
            width: `${(timer / 60) * 100}%`,
          }}
        ></div>

        <div className="splash-left"></div>
        <div className="splash-right"></div>
        <div className="typing-section">
          {/* <div className="splash-left"></div>
          <div className="splash-right"></div> */}
          {width > 768 ? (
            <>
              <h4 id="small-intro">TYPING SPEED TEST</h4>
              <h1 id="big-intro">Test Your Typing Skills</h1>
              <Stats
                wordCount={wordCount}
                charCount={charCount}
                timer={timer}
                accuracy={accuracy}
              />
              <TypingBox
                userData={userData}
                wordCount={wordCount}
                setWordCount={setWordCount}
                setCharCount={setCharCount}
                setTimer={setTimer}
                handleOpen={handleOpen}
                restart={restart}
                setRestart={setRestart}
                errorCount={errorCount}
                setErrorCount={setErrorCount}
                setAccuracy={setAccuracy}
              />
            </>
          ) : (
            <h4 id="small-intro">Mobile device doesn't support</h4>
          )}
        </div>
      </div>
      {open && (
        <div className="modal-wrapper" open={open} onClose={handleClose}>
          <div className="modal">
            <div className="left-modal">
              <img src={getImage()} alt="speed" />
            </div>
            <div className="right-modal">
              <h2>You're a {getIdentity()}</h2>
              <p>
                {getIdentity() === "Octopus" ? "Nice.." : "Well.."} You type
                with the speed of{" "}
                <span>
                  {wordCount} WPM ({charCount} CPM)
                </span>
                . Your accuracy was {accuracy}%.{" "}
                {getIdentity() === "Octopus"
                  ? "Keep Practicing."
                  : "It could be better!"}
              </p>
              <button
                onClick={() => {
                  setCharCount(0);
                  setWordCount(0);
                  setTimer(60);
                  setAccuracy(100);
                  setRestart(true);
                  handleClose();
                }}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
