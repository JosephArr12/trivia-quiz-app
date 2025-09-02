import React, { useEffect, useState } from "react";
import "./App.css"; // Import the styles

function App() {
  //Initialization the states
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // Fetch a trivia question
  const fetchQuestion = async () => {
    //Using the open trivia api, with only 1 question at a time as well as only multiple choice questions
    const res = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
    const data = await res.json();
    //Get the first result
    const q = data.results[0];
    //Randomize the answers 
    const shuffledAnswers = [...q.incorrect_answers, q.correct_answer].sort(
      () => Math.random() - 0.5
    );

    //Question will be the question that was retrieved
    setQuestion(q);
    //Answer will be the list of the answers
    setAnswers(shuffledAnswers);
    //Selected and isCorrect are reset
    setSelected(null);
    setIsCorrect(null);
  };

  // Check the answer
  const checkAnswer = (answer) => {
    setSelected(answer);
    setIsCorrect(answer === question.correct_answer);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (!question) return <p className="loading">Loading...</p>;

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h1 className="title">Trivia Quiz</h1>
        <h2
          className="question"
          dangerouslySetInnerHTML={{ __html: question.question }}
        />

        <div className="answers">
          {answers.map((a, idx) => (
            <button
              key={idx}
              className={`answer-btn ${
                selected
                  ? a === question.correct_answer
                    ? "correct"
                    : a === selected
                    ? "wrong"
                    : ""
                  : ""
              }`}
              onClick={() => !selected && checkAnswer(a)}
              dangerouslySetInnerHTML={{ __html: a }}
            />
          ))}
        </div>

        {selected && (
          <div className="feedback">
            {isCorrect ? (
              <p className="correct-text">Correct!</p>
            ) : (
              <p className="wrong-text">
                Wrong! Correct answer:{" "}
                <strong
                  dangerouslySetInnerHTML={{ __html: question.correct_answer }}
                />
              </p>
            )}
            <button className="next-btn" onClick={fetchQuestion}>
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
