const maxValueN = 12;

function initResult() {
    n = document.getElementById('n').value; 
    localStorage.setItem('n', n);
}



document.querySelectorAll('.odd-tile').forEach(button => {
    button.addEventListener('click', function() {
        const n = this.getAttribute('data-value');
        localStorage.setItem('n', n);
        window.location.href = 'result.html';
    });
});

document.querySelectorAll('.even-tile').forEach(button => {
    button.addEventListener('click', function() {
        const n = this.getAttribute('data-value');
        localStorage.setItem('n', n);
        window.location.href = 'result.html';
    });
});

