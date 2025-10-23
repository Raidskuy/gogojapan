document.addEventListener('DOMContentLoaded', async () => {
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreBoard = document.getElementById('score-board');

    let currentLessonData = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let isAnswered = false;

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page'), 10) || 0;
    const itemsPerGroup = 10;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    async function loadData() {
        try {
            const response = await fetch('/Data/N3/bunpoudbn3.json'); // Path diperbaiki
            const allBunpouData = await response.json();
            
            const start = page * itemsPerGroup;
            const end = start + itemsPerGroup;
            const lessonData = allBunpouData.slice(start, end);

            shuffleArray(lessonData);
            currentLessonData = lessonData;
            
            startQuiz();
        } catch (error) { console.error("Gagal memuat data:", error); }
    }

    function startQuiz() {
        if (currentLessonData.length === 0) {
             questionText.textContent = "Tidak ada soal.";
             optionsContainer.innerHTML = `<a href="bunpou-home.html" class="quiz-button">Kembali</a>`; // Path diperbaiki
             return;
        }
        currentQuestionIndex = 0;
        score = 0;
        updateScore();
        showNextQuestion();
    }

    function showNextQuestion() {
        isAnswered = false;
        if (currentQuestionIndex >= currentLessonData.length) {
            questionText.textContent = "Kuis Selesai!";
            optionsContainer.innerHTML = `<a href="bunpou-home.html" class="quiz-button">Kembali ke Pilihan Bunpou</a>`; // Path diperbaiki
            return;
        }

        const item = currentLessonData[currentQuestionIndex];
        
        const question = item['文法レッスン (Pola Tata Bahasa)'];
        const correctAnswer = item['Penjelasan (Arti & Penggunaan)'];
        
        const wrongAnswerPool = currentLessonData
            .map(i => i['Penjelasan (Arti & Penggunaan)'])
            .filter(v => v && v !== correctAnswer);
        
        const options = generateOptions(correctAnswer, wrongAnswerPool);
        
        questionText.textContent = question;
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => checkAnswer(button, option, correctAnswer);
            optionsContainer.appendChild(button);
        });
    }

    function generateOptions(correctAnswer, wrongAnswerPool) {
        let options = [correctAnswer];
        shuffleArray(wrongAnswerPool);
        for (let i = 0; i < wrongAnswerPool.length && options.length < 4; i++) {
            if (!options.includes(wrongAnswerPool[i])) {
                options.push(wrongAnswerPool[i]);
            }
        }
        while (options.length < 4) { options.push("---"); }
        return options.sort(() => Math.random() - 0.5);
    }

    function checkAnswer(selectedButton, selectedAnswer, correctAnswer) {
        if (isAnswered) return;
        isAnswered = true;
        const allButtons = optionsContainer.querySelectorAll('.option-button');
        const isCorrect = selectedAnswer === correctAnswer;

        if (isCorrect) {
            selectedButton.classList.add('correct');
            score += Math.round(100 / currentLessonData.length);
            updateScore();
        } else {
            selectedButton.classList.add('incorrect');
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }
        allButtons.forEach(btn => btn.disabled = true);
        setTimeout(() => {
            currentQuestionIndex++;
            showNextQuestion();
        }, 1500);
    }
    
    function updateScore() {
        scoreBoard.textContent = `Skor: ${score}`;
    }

    loadData();
});