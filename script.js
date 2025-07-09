document.addEventListener('DOMContentLoaded', function() {
    
    // --- Logic for Mobile Hamburger Menu ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.nav-menu');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            if (isVisible) {
                primaryNav.setAttribute('data-visible', 'false');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            } else {
                primaryNav.setAttribute('data-visible', 'true');
                mobileNavToggle.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // --- Logic for Language Dropdown ---
    const langButton = document.querySelector('.language-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (langButton) {
        langButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevents window.onclick from closing it immediately
            dropdownContent.classList.toggle('show');
        });
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.language-button')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
});
