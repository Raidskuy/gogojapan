document.addEventListener('DOMContentLoaded', async () => {
    const lessonTitle = document.getElementById('lesson-title');
    const lessonContent = document.getElementById('lesson-content');

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page'), 10) || 0;
    const itemsPerGroup = 10;

    try {
        const response = await fetch('/Data/N3/bunpoudbn3.json'); 
        const allBunpouData = await response.json();

        const start = page * itemsPerGroup;
        const end = start + itemsPerGroup;
        const lessonData = allBunpouData.slice(start, end);

        const titleStart = start + 1;
        const titleEnd = Math.min(end, allBunpouData.length);
        lessonTitle.textContent = `Bunpou ${titleStart} - ${titleEnd}`;

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        thead.innerHTML = '<tr><th>文法レッスン</th><th>Penjelasan</th><th>Contoh Kalimat</th><th>Arti</th></tr>';

        lessonData.forEach(item => {
            tbody.innerHTML += `<tr>
                <td>${item['文法レッスン (Pola Tata Bahasa)'] || ''}</td>
                <td>${item['Penjelasan (Arti & Penggunaan)'] || ''}</td>
                <td>${item['Contoh Kalimat'] || ''}</td>
                <td>${item['Arti Contoh Kalimat'] || ''}</td>
            </tr>`;
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        lessonContent.appendChild(table);

        const quizButton = document.createElement('a');
        quizButton.href = `bunpou-quiz.html?page=${page}`; // Path diperbaiki
        quizButton.className = 'quiz-button';
        quizButton.textContent = 'Mulai Latihan';
        lessonContent.appendChild(quizButton);

    } catch (error) {
        console.error('Error:', error);
        lessonTitle.textContent = "Error";
        lessonContent.textContent = "Gagal memuat data bunpou.";
    }
});