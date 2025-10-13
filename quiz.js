document.addEventListener('DOMContentLoaded', async () => {
    const quizTitle = document.getElementById('quiz-title');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreBoard = document.getElementById('score-board');

    let currentLessonData = [];
    let allVocabulary = { meanings: [], hiraganas: [] };
    let currentQuestionIndex = 0;
    let score = 0;
    let isAnswered = false; // Mencegah klik ganda

    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('id');
    const quizType = params.get('type');

    async function loadData() {
        try {
            const response = await fetch('./data/database.json');
            const database = await response.json();
            
            const allLessons = [...database.kotoba, ...(database.unit || []), ...(database.kotoba2 || []), ...(database.full || [])];
            const lesson = allLessons.find(l => l.id_bagian == lessonId);

            if (lesson) {
                quizTitle.textContent = `${lesson.nama_bagian}`;
                currentLessonData = lesson.data.filter(item => (item.kanji || item.Kanji) || (item.hiragana || item.Hiragana));
            }
            
            allLessons.forEach(l => {
                if (l.data) {
                    l.data.forEach(item => {
                        const arti = item.arti || item.Arti;
                        const hiragana = item.hiragana || item.Hiragana;
                        if (arti) allVocabulary.meanings.push(arti);
                        if (hiragana) allVocabulary.hiraganas.push(hiragana);
                    });
                }
            });
            startQuiz();
        } catch (error) { console.error("Gagal memuat data:", error); }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        updateScore();
        showNextQuestion();
    }

    function showNextQuestion() {
        isAnswered = false; // Siapkan untuk pertanyaan baru
        if (currentQuestionIndex >= currentLessonData.length) {
            questionText.textContent = "Kuis Selesai!";
            optionsContainer.innerHTML = `<a href="index.html" class="quiz-button">Kembali ke Home</a>`;
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
                options = generateOptions(correctAnswer, 'meanings');
                break;
            case 'kanji_to_hira':
                question = itemKanji;
                correctAnswer = itemHiragana;
                options = generateOptions(correctAnswer, 'hiraganas');
                break;
            case 'kanji_to_arti':
            default:
                question = itemKanji;
                correctAnswer = itemArti;
                options = generateOptions(correctAnswer, 'meanings');
                break;
        }
        
        questionText.textContent = question || "Soal tidak valid";

        optionsContainer.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            // --- PERUBAHAN 1: Mengirim elemen tombol saat di-klik ---
            button.onclick = () => checkAnswer(button, option, correctAnswer);
            optionsContainer.appendChild(button);
        });
    }

    function generateOptions(correctAnswer, optionType) {
        const sourceArray = allVocabulary[optionType];
        let options = [correctAnswer];
        while (options.length < 4 && sourceArray.length > 4) {
            const randomAnswer = sourceArray[Math.floor(Math.random() * sourceArray.length)];
            if (!options.includes(randomAnswer)) {
                options.push(randomAnswer);
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }

    // --- REVISI UTAMA: Logika baru untuk memeriksa jawaban dan mengubah warna ---
    function checkAnswer(selectedButton, selectedAnswer, correctAnswer) {
        if (isAnswered) return; // Jika sudah dijawab, jangan lakukan apa-apa
        isAnswered = true;

        const allButtons = optionsContainer.querySelectorAll('.option-button');
        
        if (selectedAnswer === correctAnswer) {
            // Jawaban BENAR
            selectedButton.classList.add('correct');
            score += 10;
            updateScore();
        } else {
            // Jawaban SALAH
            selectedButton.classList.add('incorrect');
            // Tunjukkan juga jawaban yang benar
            allButtons.forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }
        
        // Nonaktifkan tombol lain
        allButtons.forEach(btn => {
            if (btn !== selectedButton && btn.textContent !== correctAnswer) {
                btn.classList.add('disabled');
            }
        });

        // Jeda 1.5 detik, lalu lanjut ke pertanyaan berikutnya
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