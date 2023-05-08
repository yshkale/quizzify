"use strict";

const quizEnd = document.querySelector(".quiz-end");
const container = document.querySelector(".container-data");
const submit = document.querySelector(".submit");
const scoreContainer = document.querySelector(".score-container");
const spinner = document.querySelector(".spinner-container");

const getQuiz = async function () {
  try {
    let currentScore = 0;
    let selected = null;
    let currentQuestionIndex = 0;
    let correctAns = "";
    let incorrectAns = [];

    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
    );

    spinner.style.display = "none";
    submit.style.display = "block";

    const data = await res.json();

    console.log(res);

    if (!res.ok) {
      throw new Error(`The error we have encountered is ${res.status}`);
    }

    const displayQuestion = function () {
      const question = data.results[currentQuestionIndex].question;
      correctAns = data.results[currentQuestionIndex].correct_answer;
      incorrectAns = data.results[currentQuestionIndex].incorrect_answers.map(
        (iA) => {
          return iA;
        }
      );

      const allOptions = [correctAns, ...incorrectAns];

      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

      const markup = `
    <p class="question-number">Question ${currentQuestionIndex + 1} / 10</p>
          <h2 class="question">${question}</h2>
    `;

      const optionsMarkup =
        '<div class="options bottom-space">' +
        shuffledOptions
          .map((i) => {
            return '<button class="option">' + i + "</button>";
          })
          .join("") +
        "</div>";

      container.innerHTML = "";
      container.insertAdjacentHTML("afterbegin", optionsMarkup);
      container.insertAdjacentHTML("afterbegin", markup);
    };

    const updateScore = function () {
      scoreContainer.innerHTML = `
      <p class="score">Score: ${currentScore}</p>
      `;
    };

    const getAnswer = function () {
      //USING EVENT DELEGATION

      container.addEventListener("click", function (event) {
        if (event.target.matches(".option")) {
          selected = event.target;
        }
      });
    };

    const checkAns = function () {
      if (!selected) {
        return;
      }

      if (selected.textContent === correctAns) {
        currentScore += 10;
      } else if (selected.textContent !== correctAns && currentScore > 0) {
        currentScore -= 10;
      }

      currentQuestionIndex++;
      if (currentQuestionIndex < data.results.length) {
        displayQuestion();
        selected = null;
      } else {
        updateScore();
        const endMarkup = `
      <img
            class="quiz-end-img"
            src="img/quiz-ended-thankyou.svg"
            alt="Image to display that the quiz has ended."
          />
          <h2 class="end-heading">Quiz Ended! Thankyou for playing.</h2>
          <p class="end-info">You scored ${currentScore} out of 100.</p>
          `;
        container.innerHTML = "";
        quizEnd.insertAdjacentHTML("afterbegin", endMarkup);
        submit.style.display = "none";
      }
      updateScore();
    };

    submit.addEventListener("click", checkAns);

    displayQuestion();
    updateScore();
    getAnswer();
  } catch (err) {
    console.error(err);
  }
};

getQuiz();
