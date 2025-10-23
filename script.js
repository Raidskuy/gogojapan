document.addEventListener('DOMContentLoaded', () => {
    const levelButtons = document.querySelectorAll('.level-button');

    levelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const level = button.getAttribute('data-level');
            
            if (level !== 'n3') {
                e.preventDefault(); // Mencegah pindah halaman
                alert(`Materi untuk ${level.toUpperCase()} belum tersedia.`);
            }
            // Jika N3, biarkan link-nya (href="category.html?level=n3") bekerja
        });
    });
});