import { useState, useEffect, useRef } from "react";
import { words } from "../data/words";

const getCountOfSame = (s1, s2) => {
  let n = s1.length;
  let m = s2.length;
  let i = 0;
  let count = 0;
  while (i < n && i < m) {
    if (s1[i] === s2[i]) {
      count++;
    } else {
      break;
    }
    i++;
  }
  return count;
};

const getRandom = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

function TypingBox({
  setWordCount,
  setCharCount,
  setTimer,
  handleOpen,
  restart,
  setRestart,
  setErrorCount,
  errorCount,
  wordCount,
  setAccuracy,
}) {
  const [text, setText] = useState(null);
  const [curWord, setCurWord] = useState("");
  const [done, setDone] = useState([]);
  const [started, setStarted] = useState(false);
  const [wordStart, setWordStart] = useState(true);
  const inputRef = useRef(null);
  useEffect(() => {
    let dummyText = getRandom(words, 300);
    setText(dummyText);
    setCurWord(dummyText[0]);
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (restart) {
      let dummyText = getRandom(words, 300);
      setText(dummyText);
      setCurWord(dummyText[0]);
      inputRef.current.disabled = false;
      inputRef.current.focus();
      setDone([]);
      setStarted(false);
      setWordStart(true);
      setRestart(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restart]);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          inputRef.current.disabled = true;
          handleOpen();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleChange = (e) => {
    if (!started) {
      setStarted(true);
      startTimer();
    }
    let inputText = e.target.value;
    if (inputText.indexOf(" ") >= 0) {
      return;
    }
    let pendingWord = curWord;

    pendingWord = pendingWord.substring(getCountOfSame(inputText, pendingWord));

    let pendingWords = text;
    pendingWords[0] = pendingWord;
    setText(pendingWords);
    let doneWords = [...done];
    if (wordStart) {
      setWordStart(false);
      doneWords.push({
        word: inputText,
        correct: curWord.startsWith(inputText),
      });
    } else {
      doneWords[doneWords.length - 1] = {
        word: inputText,
        correct: curWord.startsWith(inputText),
      };
    }
    setDone(doneWords);
  };

  const handleSpacePress = (e) => {
    if (e.key === " ") {
      if (inputRef.current.value === "") {
        return;
      }
      let e = errorCount,
        w = wordCount;
      let doneWords = done;
      let doneLength = done.length;
      let lastWord = doneWords[doneLength - 1].word;
      if (lastWord !== curWord) {
        doneWords[doneLength - 1] = {
          word: lastWord,
          correct: false,
        };
        setErrorCount((prev) => prev + 1);
        setDone(doneWords);
        e = e + 1;
      } else {
        setWordCount((prev) => prev + 1);
        setCharCount((prev) => prev + lastWord.length);
        w = w + 1;
      }
      if (w > 0) {
        setAccuracy(Math.floor((w / (e + w)) * 100));
      } else {
        setAccuracy(0);
      }
      const pendingWords = text;
      pendingWords.shift();
      setText(pendingWords);
      setWordStart(true);
      setCurWord(pendingWords[0]);
      setDone((prev) => [...prev, { word: "", correct: true }]);
    }
  };
  return (
    <div className="typing" onClick={() => inputRef.current.focus()}>
      <div className="done">
        {done &&
          done.map((item, i) => (
            <span
              key={i}
              style={{
                textDecoration: `${item.correct ? "none" : "line-through"}`,
              }}
            >
              {item.word}{" "}
            </span>
          ))}
      </div>
      <input
        type="text"
        value={done.length > 0 ? done[done.length - 1].word : ""}
        onChange={handleChange}
        onKeyPress={handleSpacePress}
        ref={inputRef}
      />
      <div className="doing pending-words">
        {text && text.map((el, i) => <span key={i}>{el} </span>)}
      </div>
    </div>
  );
}

export default TypingBox;
