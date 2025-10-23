document.addEventListener('DOMContentLoaded', async () => {
    const quizTitle = document.getElementById('quiz-title');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreBoard = document.getElementById('score-board');

    let currentLessonData = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let isAnswered = false;

    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('id');
    const quizType = params.get('type');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    async function loadData() {
        try {
            // Path sudah benar, naik 2 level ke root, lalu masuk ke Data/N3
            const response = await fetch('../../Data/N3/kanjidbn3.json');
            const database = await response.json();
            
            const allLessons = [
                ...(database.kotoba || []),
                ...(database.unit || []),
                ...(database.kotoba2 || []),
                ...(database.full || []),
            ];

            const lesson = allLessons.find(l => l.id_bagian == lessonId);

            if (lesson && lesson.data) {
                quizTitle.textContent = `${lesson.nama_bagian}`;
                
                const validQuizData = lesson.data.filter(item => 
                    (item.kanji || item.Kanji) && (item.hiragana || item.Hiragana) && (item.arti || item.Arti)
                );

                shuffleArray(validQuizData);
                currentLessonData = validQuizData;
                
                startQuiz();
            } else {
                 questionText.textContent = "Materi tidak ditemukan atau tidak valid untuk kuis.";
            }
        } catch (error) { console.error("Gagal memuat data:", error); }
    }

    function startQuiz() {
        if (currentLessonData.length === 0) {
            questionText.textContent = "Tidak ada soal yang bisa dibuat dari materi ini.";
            // Path sudah benar, naik 2 level ke index.html di root
            optionsContainer.innerHTML = `<a href="../../index.html" class="quiz-button">Kembali ke Home</a>`;
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
            // Path sudah benar, naik 2 level ke index.html di root
            optionsContainer.innerHTML = `<a href="../../index.html" class="quiz-button">Kembali ke Home</a>`;
            return;
        }

        const item = currentLessonData[currentQuestionIndex];
        let question, correctAnswer, options;
        
        const itemKanji = item.kanji || item.Kanji;
        const itemHiragana = item.hiragana || item.Hiragana;
        const itemArti = item.arti || item.Arti;

        switch (quizType) {
            case 'hira_to_arti':
                question = itemHiragana;
                correctAnswer = itemArti;
                options = generateOptions(correctAnswer, 'arti');
                break;
            case 'kanji_to_hira':
                question = itemKanji;
                correctAnswer = itemHiragana;
                options = generateOptions(correctAnswer, 'hiragana');
                break;
            case 'kanji_to_arti':
            default:
                question = itemKanji;
                correctAnswer = itemArti;
                options = generateOptions(correctAnswer, 'arti');
                break;
        }
        
        questionText.textContent = question || "?";

        optionsContainer.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => checkAnswer(button, option, correctAnswer);
            optionsContainer.appendChild(button);
        });
    }

    function generateOptions(correctAnswer, optionProperty) {
        let options = [correctAnswer];
        const wrongAnswerPool = currentLessonData
            .map(item => item[optionProperty] || item[optionProperty.charAt(0).toUpperCase() + optionProperty.slice(1)])
            .filter(value => value && value !== correctAnswer);

        shuffleArray(wrongAnswerPool);

        for (let i = 0; i < wrongAnswerPool.length && options.length < 4; i++) {
            if (!options.includes(wrongAnswerPool[i])) {
                options.push(wrongAnswerPool[i]);
            }
        }
        
        while (options.length < 4) {
            options.push("---");
        }

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