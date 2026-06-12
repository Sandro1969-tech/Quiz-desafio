// Banco de dados das perguntas do Quiz
const quizData = [
    {
        question: "Qual tag HTML é usada para linkar um arquivo CSS externo?",
        options: ["<script>", "<style>", "<link>", "<css>"],
        correct: 2
    },
    {
        question: "Qual propriedade CSS muda a cor de fundo de um elemento?",
        options: ["color", "background-color", "bgcolor", "background-image"],
        correct: 1
    },
    {
        question: "Como declaramos uma variável que não pode ser alterada no JavaScript?",
        options: ["let", "var", "const", "immutable"],
        correct: 2
    },
    {
        question: "O que significa a sigla 'API' no desenvolvimento de software?",
        options: [
            "Application Program Internet",
            "Application Programming Interface",
            "Advanced Protocol Integration",
            "Automated Program Interface"
        ],
        correct: 1
    },
    {
        question: "Qual comando Git é usado para enviar alterações para o repositório remoto?",
        options: ["git commit", "git pull", "git add", "git push"],
        correct: 3
    }
];

// Elementos da Interface
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const questionNumberTxt = document.getElementById('question-number');
const progressFill = document.getElementById('progress-fill');
const timerTxt = document.getElementById('timer');
const questionTxt = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const scoreTxt = document.getElementById('score-text');
const totalQuestionsTxt = document.getElementById('total-questions');
const feedbackMsg = document.getElementById('feedback-msg');

// Variáveis de Controle do Estado do Jogo
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15; // 15 segundos por pergunta
let answered = false;

// Event Listeners Principais
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    gameScreen.classList.add('active');
    showQuestion();
}

function showQuestion() {
    answered = false;
    timeLeft = 15;
    timerTxt.innerText = timeLeft;
    document.querySelector('.timer-circle').style.borderColor = "var(--cyan-neon)";
    document.querySelector('.timer-circle').style.boxShadow = "0 0 10px var(--cyan-neon)";
   
    startTimer();

    const currentQuestion = quizData[currentQuestionIndex];
   
    // Atualiza cabeçalho de progresso
    questionNumberTxt.innerText = `Pergunta ${currentQuestionIndex + 1} de ${quizData.length}`;
    const progressPercent = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Renderiza o texto da pergunta
    questionTxt.innerText = currentQuestion.question;

    // Limpa e Renderiza as alternativas
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(index, button));
        optionsContainer.appendChild(button);
    });
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerTxt.innerText = timeLeft;

        // Alerta visual quando o tempo está acabando
        if(timeLeft <= 5) {
            document.querySelector('.timer-circle').style.borderColor = "var(--wrong)";
            document.querySelector('.timer-circle').style.boxShadow = "0 0 15px var(--wrong)";
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            autoTimeOut();
        }
    }, 1000);
}

function selectOption(selectedIndex, selectedButton) {
    if (answered) return; // Evita múltiplos cliques
    answered = true;
    clearInterval(timer);

    const correctIndex = quizData[currentQuestionIndex].correct;
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    // Desabilita todos os botões para a resposta travar
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === correctIndex) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        // Mostra qual era a correta mesmo errando
        allButtons[correctIndex].classList.add('correct');
    }

    // Espera 2 segundos de "tempo real" para o usuário ver o feedback e passa de fase
    setTimeout(nextQuestion, 2000);
}

function autoTimeOut() {
    answered = true;
    const correctIndex = quizData[currentQuestionIndex].correct;
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    allButtons.forEach(btn => btn.disabled = true);
    // Destaca a correta que o usuário perdeu por tempo
    allButtons[correctIndex].classList.add('correct');

    setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');

    scoreTxt.innerText = score;
    totalQuestionsTxt.innerText = quizData.length;

    // Mensagem customizada baseada na performance
    const performanceRatio = score / quizData.length;
    if (performanceRatio === 1) {
        feedbackMsg.innerText = "🏆 Perfeito! Você domina o assunto!";
    } else if (performanceRatio >= 0.7) {
        feedbackMsg.innerText = "🔥 Muito bom! Quase um especialista!";
    } else if (performanceRatio >= 0.4) {
        feedbackMsg.innerText = "👍 Bom esforço! Continue praticando.";
    } else {
        feedbackMsg.innerText = "📚 Que tal dar uma revisada e tentar de novo?";
    }
}

 
