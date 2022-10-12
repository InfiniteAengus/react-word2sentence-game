import React, { useCallback, useRef, useState } from 'react';

import sampleData from 'src/data/mockup.json';
import {
  APP_NAME,
  HEADER_TITLE_FONT_SIZE,
  PROBLEM_COUNT,
  TIMER_FONT_SIZE,
  MONTHS,
} from 'src/config/global';
import { shuffle } from 'src/utils/helper';

import { ReactComponent as SuccessIcon } from 'src/assets/success.svg';
import { ReactComponent as FailedIcon } from 'src/assets/error.svg';

import './style.css';

const MainPage = () => {
  const [curProblemId, setCurProblemId] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [userAnswer, setUserAnswer] = useState({
    wordArray: [],
    selectedArray: [],
    sampleArray: [],
  });

  const [gameStatus, setGameStatus] = useState({
    responding: false,
    started: false,
    finished: false,
    paused: false,
    totalTimer: 0,
    curTimer: 0,
  });
  const [timerId, setTimerId] = useState(null);
  const gameStatusRef = useRef(null);

  gameStatusRef.current = gameStatus;

  const sentence2words = useCallback((sentence) => {
    return sentence.split(' ');
  }, []);

  const handleStartGame = () => {
    const randomSentences = loadSentences();
    const totalTime = randomSentences.reduce(
      (res, sentence) => res + sentence.time,
      0
    );
    setSentences(randomSentences);
    setCurProblemId(0);
    setGameStatus((prev) => ({
      ...prev,
      started: true,
      paused: false,
      finished: false,
      totalTimer: -totalTime,
      curTimer: -randomSentences[0].time,
    }));

    revealSentence(randomSentences, 0);

    if (timerId) {
      clearInterval(timerId);
    }

    const tId = setInterval(() => intervalHander(), 1000);

    setTimerId(tId);
  };

  const handlePauseGame = () => {
    setGameStatus((prev) => ({ ...prev, paused: !prev.paused }));
  };

  const handleWordClick = (index) => {
    if (gameStatus.responding) {
      return;
    }

    const newSelected = userAnswer.selectedArray.map((i) => i);
    const newWordArray = userAnswer.wordArray.map((i) => i);
    const selectedWord = userAnswer.wordArray[index].word;

    const exact = userAnswer.sampleArray[newSelected.length] === selectedWord;

    if (!exact) {
      setGameStatus((prev) => ({ ...prev, responding: true }));
      setTimeout(() => {
        setCurProblemId(0);
        revealSentence(sentences, 0);
        setGameStatus((prev) => ({ ...prev, responding: false }));
      }, 2000);
    }

    if (exact && newSelected.length + 1 === userAnswer.sampleArray.length) {
      handleNextProblem();
    }

    newSelected.push({
      word: selectedWord,
      exact: exact,
    });

    newWordArray[index].used = true;

    setUserAnswer((prev) => ({
      ...prev,
      selectedArray: newSelected,
      wordArray: newWordArray,
    }));
  };

  const handleNextProblem = () => {
    if (curProblemId + 1 === PROBLEM_COUNT) {
      setGameStatus((prev) => ({ ...prev, finished: true }));
      setCurProblemId((prev) => prev + 1);
      clearInterval(timerId);
    } else {
      setCurProblemId((prev) => {
        revealSentence(sentences, prev + 1);
        setGameStatus((prevGameStatus) => ({
          ...prevGameStatus,
          curTimer: -sentences[prev + 1].time,
        }));
        return prev + 1;
      });
    }
  };

  const intervalHander = () => {
    if (gameStatusRef.current.paused) {
      return;
    }
    setGameStatus((prev) => ({
      ...prev,
      totalTimer: prev.totalTimer + 1,
      curTimer: prev.curTimer + 1,
    }));
  };

  const loadSentences = () => {
    const temp = shuffle(sampleData, PROBLEM_COUNT);

    return temp.map((sentence) => {
      const data = sentence.split('=');
      return {
        sentence: data[0].toLowerCase().replace(/[.,]/g, ''),
        time: Number(data[1]),
      };
    });
  };

  const revealSentence = (sentenceArray, pId) => {
    const words = sentence2words(sentenceArray[pId].sentence);
    const mixedWords = shuffle(words, words.length);

    setUserAnswer({
      sampleArray: words,
      selectedArray: [],
      wordArray: mixedWords.map((word) => ({ word: word, used: false })),
    });
  };

  return (
    <main>
      <div className='container'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: HEADER_TITLE_FONT_SIZE }}>{APP_NAME}</h2>
            <h4>{`${
              MONTHS[new Date().getMonth()]
            } ${new Date().getDate()}, ${new Date().getFullYear()}`}</h4>
          </div>
          {gameStatus.started && (
            <div style={{ display: 'flex', gap: '20px', marginLeft: 'auto' }}>
              <button onClick={handlePauseGame}>
                {gameStatus.paused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={handleStartGame}>Reset</button>
            </div>
          )}
        </div>

        {gameStatus.started ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: TIMER_FONT_SIZE,
              }}
            >
              <h4>{gameStatus.totalTimer}</h4>
              <h4>{gameStatus.curTimer}</h4>
            </div>

            {gameStatus.finished ? (
              <>
                <h1>Great job! Come back tomorrow for a fresh 12!</h1>
              </>
            ) : (
              <div
                style={{ position: 'relative' }}
                className={gameStatus.responding ? 'selected-failed' : ''}
              >
                {gameStatus.paused && (
                  <div className='paused-background'>
                    <h1>Paused</h1>
                  </div>
                )}
                <div className='made-sentence'>
                  <p>
                    {userAnswer.selectedArray.map((word, index) => (
                      <span
                        style={{ color: word.exact ? 'black' : 'red' }}
                        key={`selected-word-${index}`}
                      >
                        {word.word} &nbsp;
                      </span>
                    ))}
                  </p>
                </div>

                <div className='game-status'>
                  <h3>
                    {curProblemId + 1}/{PROBLEM_COUNT}
                  </h3>
                  <div className='result-icon-wrapper'>
                    {Array(PROBLEM_COUNT)
                      .fill(0)
                      .map((_, ind) => (
                        <span
                          className='result-icon'
                          key={`result-icon-${ind}`}
                        >
                          {ind < curProblemId ? (
                            <SuccessIcon />
                          ) : (
                            <FailedIcon />
                          )}
                        </span>
                      ))}
                  </div>
                  <h4>{`#${curProblemId + 1} - beat ${
                    sentences[curProblemId]?.time
                  } seconds!`}</h4>
                </div>

                <div className='words-wrapper'>
                  {userAnswer.wordArray.map((word, index) => (
                    <div key={`word-item-${index}`} className='word-item'>
                      {!word.used ? (
                        <span onClick={() => handleWordClick(index)}>
                          {word.word}
                        </span>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1>Descramble {PROBLEM_COUNT} quotes!</h1>
            <button onClick={handleStartGame}>Begin</button>
          </>
        )}
      </div>
    </main>
  );
};

export default MainPage;
