document.addEventListener('DOMContentLoaded', async () => {
    const lessonTitle = document.getElementById('lesson-title');
    const lessonContent = document.getElementById('lesson-content');

    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('id');

    if (!lessonId) {
        lessonTitle.textContent = "Error";
        lessonContent.textContent = "ID pelajaran tidak ditemukan.";
        return;
    }

    try {
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
            lessonTitle.textContent = "Error";
            lessonContent.textContent = "Pelajaran tidak ditemukan.";
            return;
        }

        lessonTitle.textContent = lesson.nama_bagian;
        
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        if (lesson.tipe === 'kotoba' || lesson.tipe === 'k' || lesson.tipe === 'u') {
            thead.innerHTML = '<tr><th>Kanji</th><th>Hiragana</th><th>Arti</th></tr>';
            lesson.data.forEach(item => {
                tbody.innerHTML += `<tr><td>${item.Kanji || item.kanji || ''}</td><td>${item.Hiragana || item.hiragana || ''}</td><td>${item.Arti || item.arti || ''}</td></tr>`;
            });
        } 
        else if (lesson.tipe === 'jt') {
             thead.innerHTML = '<tr><th>Jidoushi (Keadaan)</th><th>Tadoushi (Aksi)</th></tr>';
            lesson.data.forEach(item => {
                const jidoushiText = `${item.jidoushi_kanji || ''} (${item.jidoushi_hiragana || ''}): ${item['jidoushi_arti '] || ''}`;
                const tadoushiText = `${item.tadoushi_kanji || ''} (${item.tadoushi_bentuk_formal || ''}): ${item['tadoushi_arti '] || ''}`;
                tbody.innerHTML += `<tr><td>${jidoushiText}</td><td>${tadoushiText}</td></tr>`;
            });
        }
        else if (lesson.tipe === 'ku') {
            thead.innerHTML = '<tr><th>Kotoba</th><th>Arti</th></tr>';
            lesson.data.forEach(item => {
                tbody.innerHTML += `<tr><td>${item.kotoba || ''}</td><td>${item['arti '] || ''}</td></tr>`;
            });
        }
        else if (lesson.tipe === 'gkk' || lesson.tipe === 'kk') {
             thead.innerHTML = '<tr><th>Kata</th><th>Arti</th><th>Contoh Kalimat</th></tr>';
             lesson.data.forEach(item => {
                const kata = item.Kata || item['Kanji Kerja'] || '';
                const arti = item.Arti || item.Artinya || '';
                const contoh = item.Contoh || item['Contoh Kalimat'] || '';
                tbody.innerHTML += `<tr><td>${kata}</td><td>${arti}</td><td>${contoh}</td></tr>`;
            });
        }
        else if (lesson.tipe === 'p') {
            thead.innerHTML = '<tr><th>Bentuk Dasar</th><th>Arti</th></tr>';
            lesson.data.forEach(item => {
                tbody.innerHTML += `<tr><td>${item['Bentuk Dasar'] || ''}</td><td>${item.Arti || ''}</td></tr>`;
            });
        }
        
        table.appendChild(thead);
        table.appendChild(tbody);
        lessonContent.appendChild(table);

        // --- REVISI UTAMA: Membuat Kontainer untuk Tombol Kuis ---
        const quizSectionTitle = document.createElement('h2');
        quizSectionTitle.className = 'quiz-section-title';
        quizSectionTitle.textContent = 'Pilih Tipe Latihan';
        lessonContent.appendChild(quizSectionTitle);

        const quizButtonsContainer = document.createElement('div');
        quizButtonsContainer.className = 'quiz-buttons-container-horizontal';

        const quizTypes = [
            { type: 'hira_to_arti', label: 'A', desc: 'Hiragana → Arti' },
            { type: 'kanji_to_hira', label: 'B', desc: 'Kanji → Hiragana' },
            { type: 'kanji_to_arti', label: 'C', desc: 'Kanji → Arti' },
        ];

        quizTypes.forEach(q => {
            const button = document.createElement('a');
            button.href = `../Quiz/quiz.html?id=${lessonId}&type=${q.type}`;
            button.className = 'quiz-button-choice';
            button.innerHTML = `<span>${q.label}</span><p>${q.desc}</p>`;
            
            // Logika menonaktifkan tombol
            if ((q.type === 'kanji_to_hira' || q.type === 'kanji_to_arti') && (lesson.tipe === 'ku' || !lesson.data.some(item => item.kanji || item.Kanji))) {
                button.classList.add('disabled');
            }
             if (lesson.tipe === 'jt' || lesson.tipe === 'p') {
                button.classList.add('disabled');
            }

            quizButtonsContainer.appendChild(button);
        });

        lessonContent.appendChild(quizButtonsContainer);

    } catch (error) {
        console.error('Error:', error);
    }
});