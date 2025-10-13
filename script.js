document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');

    // Mengambil data dari file database.json
    fetch('./data/database.json')
        .then(response => response.json())
        .then(database => {
            // Menggabungkan semua bagian pelajaran menjadi satu array
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

            // Membuat elemen untuk setiap pelajaran dan menambahkannya ke grid
            // ... (kode fetch tetap sama)

            allLessons.forEach(lesson => {
                const lessonCard = document.createElement('a');
                
                // --- PERUBAHAN DI SINI ---
                // Sekarang link-nya mengarah ke lesson.html sambil membawa id_bagian
                lessonCard.href = `lesson.html?id=${lesson.id_bagian}`; 
                // -------------------------

                lessonCard.className = 'grid-item';
                lessonCard.textContent = lesson.nama_bagian;
                
                gridContainer.appendChild(lessonCard);
            });
        })
        .catch(error => {
            console.error('Error memuat database:', error);
            gridContainer.textContent = 'Gagal memuat data. Pastikan file database.json ada di folder data.';
        });
});