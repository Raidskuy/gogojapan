document.addEventListener('DOMContentLoaded', () => {
    const levelSelection = document.getElementById('level-selection');
    const gridContainer = document.getElementById('grid-container');
    const levelButtons = document.querySelectorAll('.level-button');

    // Tambahkan event listener untuk setiap tombol level
    levelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah link '#' berpindah halaman
            
            const selectedLevel = button.getAttribute('data-level');
            
            // Saat ini, kita hanya punya data N3
            if (selectedLevel === 'n3') {
                // Sembunyikan pilihan level
                levelSelection.style.display = 'none';
                // Tampilkan grid
                gridContainer.style.display = 'grid';
                // Panggil fungsi untuk memuat pelajaran N3
                loadLessonGrid();
            } else {
                alert(`Materi untuk ${selectedLevel.toUpperCase()} belum tersedia.`);
            }
        });
    });

    /**
     * Fungsi ini berisi semua kode lama kita.
     * Ia akan memuat database.json dan membangun grid pelajaran.
     */
    function loadLessonGrid() {
        // Mengambil data dari file database.json
        fetch('./Data/Database.json') // Pastikan path ini benar
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
                allLessons.forEach(lesson => {
                    const lessonCard = document.createElement('a');
                    // Pastikan path ke lesson.html sudah benar
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
    }
});