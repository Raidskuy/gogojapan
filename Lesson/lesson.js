document.addEventListener('DOMContentLoaded', async () => {
    const lessonTitle = document.getElementById('lesson-title');
    const lessonContent = document.getElementById('lesson-content');

    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('id');

    if (!lessonId) {
        // ... (kode error tetap sama)
        return;
    }

    try {
    // Note: folder in workspace is `Data/Database.json` (capitalized). Use that path.
    // From Lesson/lesson.js, the relative path to project root is '../Data/Database.json'
    const response = await fetch('../Data/Database.json');
        const database = await response.json();

        const allLessons = [
            ...database.kotoba,
            ...(database['jidoushi dan tadoushi'] || []),
            ...(database['kata unik'] || []),
            ...(database.masu || []),
            ...(database['gabungan kk'] || []),
            ...(database.full || []),
            ...(database.perubahan || []),
            ...(database.kotoba2 || []),
            ...(database.unit || []),
        ];

    const lesson = allLessons.find(l => l.id_bagian == lessonId);

        if (!lesson) {
            // ... (kode error tetap sama)
            return;
        }

        if (!lessonTitle || !lessonContent) {
            console.error('Missing DOM elements: #lesson-title or #lesson-content');
            return;
        }

        lessonTitle.textContent = lesson.nama_bagian || '';
        
        // ... (kode untuk membuat tabel materi tetap sama persis seperti sebelumnya) ...
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        // Ensure lesson.data is an array to avoid runtime errors
        const lessonData = Array.isArray(lesson.data) ? lesson.data : [];

        if (lesson.tipe === 'kotoba' || lesson.tipe === 'k') {
            thead.innerHTML = '<tr><th>Kanji</th><th>Hiragana</th><th>Arti</th></tr>';
            lessonData.forEach(item => {
                tbody.innerHTML += `<tr><td>${item.Kanji || item.kanji || ''}</td><td>${item.Hiragana || item.hiragana || ''}</td><td>${item.Arti || item.arti || ''}</td></tr>`;
            });
        } 
        else if (lesson.tipe === 'jt') {
             thead.innerHTML = '<tr><th>Jidoushi (Keadaan)</th><th>Tadoushi (Aksi)</th></tr>';
            lessonData.forEach(item => {
                // Normalize possible key names and avoid trailing-space keys
                const jidoushiArti = item.jidoushi_arti || item.jidoushiArti || item['jidoushi_arti'] || '';
                const tadoushiArti = item.tadoushi_arti || item.tadoushiArti || item['tadoushi_arti'] || '';
                const jidoushiText = `${item.jidoushi_kanji || ''} (${item.jidoushi_hiragana || ''}): ${jidoushiArti}`;
                const tadoushiText = `${item.tadoushi_kanji || ''} (${item.tadoushi_bentuk_formal || item.tadoushi_bentuk || ''}): ${tadoushiArti}`;
                tbody.innerHTML += `<tr><td>${jidoushiText}</td><td>${tadoushiText}</td></tr>`;
            });
        }
        else if (lesson.tipe === 'ku') {
            thead.innerHTML = '<tr><th>Kotoba</th><th>Arti</th></tr>';
            lessonData.forEach(item => {
                tbody.innerHTML += `<tr><td>${item.kotoba || item.Kotoba || ''}</td><td>${item.arti || item.Arti || ''}</td></tr>`;
            });
        }
        else if (lesson.tipe === 'gkk' || lesson.tipe === 'kk') {
             thead.innerHTML = '<tr><th>Kata</th><th>Arti</th><th>Contoh Kalimat</th></tr>';
             lessonData.forEach(item => {
                const kata = item.Kata || item['Kanji Kerja'] || item.kata || '';
                const arti = item.Arti || item.Artinya || item.arti || '';
                const contoh = item.Contoh || item['Contoh Kalimat'] || item.contoh || '';
                tbody.innerHTML += `<tr><td>${kata}</td><td>${arti}</td><td>${contoh}</td></tr>`;
            });
        }
        else if (lesson.tipe === 'p') {
            thead.innerHTML = '<tr><th>Bentuk Dasar</th><th>Arti</th></tr>';
            lessonData.forEach(item => {
                tbody.innerHTML += `<tr><td>${item['Bentuk Dasar'] || item.bentuk_dasar || ''}</td><td>${item.Arti || item.arti || ''}</td></tr>`;
            });
        }
        
        table.appendChild(thead);
        table.appendChild(tbody);
        lessonContent.appendChild(table);

        // --- REVISI UTAMA: Membuat Kontainer untuk Tombol Kuis ---
        const quizButtonsContainer = document.createElement('div');
        quizButtonsContainer.className = 'quiz-buttons-container';

        // Tombol 1: Hiragana -> Arti
        const button1 = document.createElement('a');
        button1.href = `../Quiz/quiz.html?id=${lessonId}&type=hira_to_arti`;
        button1.className = 'quiz-button';
        button1.textContent = 'Latihan: Hiragana -> Arti';
        
        // Tombol 2: Kanji -> Hiragana
        const button2 = document.createElement('a');
        button2.href = `../Quiz/quiz.html?id=${lessonId}&type=kanji_to_hira`;
        button2.className = 'quiz-button';
        button2.textContent = 'Latihan: Kanji -> Hiragana';

        // Tombol 3: Kanji -> Arti
        const button3 = document.createElement('a');
        button3.href = `../Quiz/quiz.html?id=${lessonId}&type=kanji_to_arti`;
        button3.className = 'quiz-button';
        button3.textContent = 'Latihan: Kanji -> Arti';

        // Logika untuk menonaktifkan tombol jika tidak relevan
        // Disable irrelevant quiz buttons by removing their href and marking aria-disabled
        function disableButton(btn) {
            btn.classList.add('disabled');
            btn.setAttribute('aria-disabled', 'true');
            // remove href to avoid navigation
            btn.removeAttribute('href');
            // prevent clicks just in case
            btn.addEventListener('click', (e) => e.preventDefault());
        }

        if (lesson.tipe === 'ku') { // Kata Unik tidak punya kanji
            disableButton(button2);
            disableButton(button3);
        }
        if (lesson.tipe === 'jt' || lesson.tipe === 'p') { // Jidoushi & Perubahan tidak cocok untuk kuis simpel
            disableButton(button1);
            disableButton(button2);
            disableButton(button3);
        }

        quizButtonsContainer.appendChild(button1);
        quizButtonsContainer.appendChild(button2);
        quizButtonsContainer.appendChild(button3);
        lessonContent.appendChild(quizButtonsContainer);

    } catch (error) {
        console.error('Error:', error);
    }
});