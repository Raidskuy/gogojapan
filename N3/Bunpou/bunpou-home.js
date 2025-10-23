document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('bunpou-grid-container');

    // Path diperbaiki: naik 2 level, lalu masuk Data/N3/
    fetch('/Data/N3/bunpoudbn3.json')
        .then(response => response.json())
        .then(allBunpouData => {
            
            const totalItems = allBunpouData.length;
            const itemsPerGroup = 10;
            const groupCount = Math.ceil(totalItems / itemsPerGroup);

            for (let i = 0; i < groupCount; i++) {
                const start = (i * itemsPerGroup) + 1;
                const end = Math.min((i + 1) * itemsPerGroup, totalItems);

                const groupCard = document.createElement('a');
                // Path diperbaiki: file lesson ada di folder yang sama
                groupCard.href = `bunpou-lesson.html?page=${i}`; 
                groupCard.className = 'grid-item';
                groupCard.textContent = `Bunpou ${start} - ${end}`;
                
                gridContainer.appendChild(groupCard);
            }
        })
        .catch(error => {
            console.error('Error memuat database bunpou:', error);
            gridContainer.textContent = 'Gagal memuat data Bunpou.';
        });
});