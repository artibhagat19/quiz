const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');

let currentQuiz = 0;
let score = 0;
let quizData = [];


async function fetchQuizData() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple');
    const data = await response.json();
    quizData = data.results.map(item => ({
        question: item.question,
        correct: item.correct_answer,
        options: shuffleOptions([item.correct_answer, ...item.incorrect_answers])
    }));
    loadQuiz();
}


function shuffleOptions(options) {
    return options.sort(() => Math.random() - 0.5);
}

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];

    questionEl.innerHTML = decodeHTML(currentQuizData.question);
    a_text.innerText = decodeHTML(currentQuizData.options[0]);
    b_text.innerText = decodeHTML(currentQuizData.options[1]);
    c_text.innerText = decodeHTML(currentQuizData.options[2]);
    d_text.innerText = decodeHTML(currentQuizData.options[3]);
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false);
}


function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.nextElementSibling.innerText;
        }
    });
    return answer;
}


submitBtn.addEventListener('click', () => {
    const answer = getSelected();

    if (answer) {
        if (answer === quizData[currentQuiz].correct) {
            score++;
        }

        currentQuiz++;

        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            quiz.innerHTML = `
                <h2>You answered ${score}/${quizData.length} questions correctly</h2>
                <button onclick="location.reload()">Reload</button>
            `;
        }
    }
});


function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}


fetchQuizData();
