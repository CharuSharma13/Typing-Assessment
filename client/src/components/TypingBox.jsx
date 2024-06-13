import { useState, useEffect, useRef } from "react";
import { words } from "../data/words";
import axios from "axios";

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
  userData,
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
  const [input, setInput] = useState("");
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
      setInput("");
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
    setStarted(true);
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
      startTimer();
    }
    if (e.target.value.indexOf(" ") >= 0) {
      return;
    }
    let inputText = e.target.value;
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
      setDone(doneWords);
    } else {
      doneWords[doneWords.length - 1] = {
        word: inputText,
        correct: curWord.startsWith(inputText),
      };
      setDone(doneWords);
    }
    setInput(e.target.value);
  };

  const handleSpacePress = (e) => {
    if (e.key === " ") {
      if (inputRef.current.value === "") {
        return;
      }
      let e, w;
      if (input !== curWord) {
        let doneWords = done;
        let doneLength = doneWords.length;
        doneWords[doneLength - 1] = {
          word: doneWords[doneLength - 1].word,
          correct: false,
        };
        e = errorCount;
        w = wordCount;
        setErrorCount((prev) => prev + 1);
        if (wordCount > 0) {
          setAccuracy(Math.floor((w / (e + w + 1)) * 100));
        } else {
          setAccuracy(0);
        }
        setDone(doneWords);
      } else {
        setWordCount((prev) => prev + 1);
        e = errorCount;
        w = wordCount;
        if (wordCount + 1 > 0) {
          setAccuracy(Math.floor(((w + 1) / (e + w + 1)) * 100));
        } else {
          setAccuracy(0);
        }
        setCharCount((prev) => prev + done[done.length - 1].word.length);
      }
      const pendingWords = text;
      pendingWords.shift();
      setText(pendingWords);
      setInput("");
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
        value={input}
        onChange={handleChange}
        onKeyPress={handleSpacePress}
        ref={inputRef}
      />
      <div className="doing">
        {text && text.map((el, i) => <span key={i}>{el} </span>)}
      </div>
    </div>
  );
}

export default TypingBox;
