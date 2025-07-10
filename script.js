document.addEventListener('DOMContentLoaded', function() {
    
    // --- Sitewide Menu Logic ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const langButton = document.querySelector('.language-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isVisible = navMenu.getAttribute('data-visible') === 'true';
            navMenu.setAttribute('data-visible', !isVisible);
        });
    }

    if (langButton && dropdownContent) {
        langButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
    }
    document.addEventListener('click', (event) => {
        if (langButton && !langButton.contains(event.target) && dropdownContent && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});