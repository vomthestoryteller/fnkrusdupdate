
document.addEventListener('DOMContentLoaded', () => {
    const goToTopBtn = document.getElementById('goToTopBtn');

    if (!goToTopBtn) return;

    const scrollThreshold = 300; // Show button after scrolling 300px

    const toggleButtonVisibility = () => {
        if (window.scrollY > scrollThreshold) {
            goToTopBtn.classList.remove('hidden');
        } else {
            goToTopBtn.classList.add('hidden');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    window.addEventListener('scroll', toggleButtonVisibility);
    goToTopBtn.addEventListener('click', scrollToTop);
});
