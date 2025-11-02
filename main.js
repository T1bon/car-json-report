// main.js
import { DataManager } from './DataManager.js';
import { Renderer } from './Renderer.js';

// --- Обработчик загрузки файла ---
document.getElementById('fileInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        try {
            await DataManager.loadFile(file);
            Renderer.displayReport();
        } catch (error) {
            alert('Ошибка при чтении файла: ' + error.message);
        }
    }
});
// --- Конец обработчика ---


// --- Глобальные функции для модального окна ---
// Эти функции нужно будет сделать глобальными, чтобы их мог вызвать HTML.
// Это можно сделать, добавив их в объект window.
window.openModal = function(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImg.src = imageSrc;
};

window.closeModal = function() {
    document.getElementById('imageModal').style.display = 'none';
};

document.getElementById('imageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        window.closeModal();
    }
});
// --- Конец глобальных функций ---