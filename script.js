const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

// populating our quiz questions from json file
fetch("questions.json")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    localStorage.setItem("myQuestions", JSON.stringify(loadedQuestions));
  })
  .catch((err) => {
    console.error(err);
  });

const myQuestions = JSON.parse(localStorage.getItem("myQuestions"));

function buildQuiz(){
    // variable to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach(
        (currentQuestion, questionNumber) => {

            // variable to store the list of possible answers
            const answers = [];

            // and for each available answer...
            for(choice in currentQuestion.answers){
                // ...add an HTML radio button
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${choice}">
                        ${choice} :
                        ${currentQuestion.answers[choice]}
                    </label>`
                );
            }

            // add the question and its answers to the output
            output.push(
                `<div class="slide">
                  <div class="question"> ${currentQuestion.question} </div>
                  <div class="answers"> ${answers.join('')} </div>
                </div>` 
            );
        }
    );

    // finally combine our outputs list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join('');
}

function showResults(){

    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll('.answers');

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach(
        (currentQuestion, questionNumber) => {

            // find selected answer
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name="question${questionNumber}"]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;

            // if answer is correct
            if(userAnswer === currentQuestion.correctAnswer){
                //add to the number of correct answers
                numCorrect++;
                console.log(numCorrect)
            }
        });

        //Update the progress bar to 100%
        progressBarFull.style.width = `${100}%`;

        // show number of correct answers out of total
        resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
}

function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    if(currentSlide === slides.length-1){
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    }
    else{
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }
}

// display quiz right now
buildQuiz();

// Pagination
const nextButton = document.getElementById("next");
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

// Show the first slide
showSlide(currentSlide);

function showNextSlide() {
  showSlide(currentSlide + 1);

  //Update the progress bar
  progressBarFull.style.width = `${(currentSlide / myQuestions.length) * 100}%`;
}

// Event listeners

// navigate to the next slide
nextButton.addEventListener("click", showNextSlide);
// on submit, show results
submitButton.addEventListener('click', showResults);
