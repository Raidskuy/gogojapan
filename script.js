document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');

    // Path diubah di sini
    fetch('./Data/Database.json')
        .then(response => response.json())
        .then(database => {
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

            allLessons.forEach(lesson => {
                const lessonCard = document.createElement('a');
                // Path diubah di sini
                lessonCard.href = `Lesson/lesson.html?id=${lesson.id_bagian}`;
                lessonCard.className = 'grid-item';
                lessonCard.textContent = lesson.nama_bagian;
                
                gridContainer.appendChild(lessonCard);
            });
        })
        .catch(error => {
            console.error('Error memuat database:', error);
            gridContainer.textContent = 'Gagal memuat data.';
        });
});