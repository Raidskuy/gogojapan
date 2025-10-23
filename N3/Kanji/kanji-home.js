document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');

    // PERBAIKAN: Path ke file JSON di Data/N3/
    fetch('/Data/N3/kanjidbn3.json') 
        .then(response => response.json())
        .then(database => {
            // Asumsi: "database" adalah nama objek di dalam JSON, 
            // atau jika file JSON-nya adalah array, Anda perlu menyesuaikan ini.
            // Kode Anda sepertinya mengharapkan objek dengan key (kotoba, dll.)
            // Mari kita asumsikan file kanjidbn3.json berisi objek seperti itu.
            const allLessons = [
                ...(database.kotoba || []),
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
                // PERBAIKAN: Path ke lesson.html di folder Lesson
                lessonCard.href = `../Lesson/lesson.html?id=${lesson.id_bagian}`; 
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