document.addEventListener("DOMContentLoaded", function() {
  const topicDropdown = document.getElementById("topics");
  const quizQuestionsContainer = document.getElementById("quiz-questions");
  const quizResultsContainer = document.getElementById("quiz-results");

  topicDropdown.addEventListener("change", async function() {
    const selectedTopic = topicDropdown.value;
    if (selectedTopic) {
      try {
        const response = await fetch(`data/${selectedTopic}.json`);
        const data = await response.json();
        renderQuizQuestions(data.questions);
      } catch (error) {
        console.error("Error loading quiz data:", error);
      }
    } else {
      quizQuestionsContainer.innerHTML = "";
      quizResultsContainer.innerHTML = "";
    }
  });

  function renderQuizQuestions(questions) {
    quizQuestionsContainer.innerHTML = "";
    quizResultsContainer.innerHTML = "";

    questions.forEach((question, index) => {
      const questionElement = document.createElement("div");
      questionElement.innerHTML = `
        <p>${index + 1}. ${question.text}</p>
        ${question.choices.map(choice => `
          <div>
            <input type="radio" id="${index}-${choice}" name="question-${index}" value="${choice}">
            <label for="${index}-${choice}">${choice}</label>
          </div>
        `).join("")}
      `;
      quizQuestionsContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", calculateScore);
    quizQuestionsContainer.appendChild(submitButton);

    quizQuestionsContainer.classList.remove("hidden");
  }

  function calculateScore() {
    const questions = Array.from(quizQuestionsContainer.querySelectorAll("div"));
    let score = 0;

    questions.forEach((question, index) => {
      const selectedAnswer = question.querySelector("input:checked");
      if (selectedAnswer) {
        const userAnswer = selectedAnswer.value;
        const correctAnswer = questions[index].getAttribute("data-answer");
        if (userAnswer === correctAnswer) {
          score++;
        }
      }
    });

    renderQuizResults(score);
  }

  function renderQuizResults(score) {
    quizQuestionsContainer.classList.add("hidden");
    quizResultsContainer.innerHTML = `
      <h2>Quiz Results</h2>
      <p>Your score: ${score}</p>
    `;
    quizResultsContainer.classList.remove("hidden");
  }
});
