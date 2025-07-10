document.addEventListener('DOMContentLoaded', function() {

    // --- Global Constants & Selectors ---
    // Make sure this matches your Clerk Publishable Key
    const CLERK_PUBLISHABLE_KEY = "pk_test_bW9yYWwtYm9hLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
    const CLERK_SCRIPT_URL = `https://moral-boa-38.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;

    const navMenu = document.getElementById('primary-navigation'); // The main nav container for mobile toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

    // --- Language Dropdown Logic ---
    const langButton = document.querySelector('.language-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (langButton && dropdownContent) {
        langButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevents click from bubbling to window.onclick immediately
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            dropdownContent.classList.toggle('show', !isExpanded); // Toggle 'show' based on expansion
        });

        // Close the dropdown if the user clicks outside of it
        document.addEventListener('click', function(event) {
            // Check if the click was outside both the button and the dropdown content
            if (!langButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                if (dropdownContent.classList.contains('show')) {
                    langButton.setAttribute('aria-expanded', 'false');
                    dropdownContent.classList.remove('show');
                }
            }
        });

        // Close dropdown on focusout (for keyboard navigation accessibility)
        dropdownContent.addEventListener('focusout', function(event) {
            // Check if the focus is moving outside the dropdown and its children
            if (!dropdownContent.contains(event.relatedTarget) && !langButton.contains(event.relatedTarget)) {
                langButton.setAttribute('aria-expanded', 'false');
                dropdownContent.classList.remove('show');
            }
        });
    }

    // --- Mobile Navigation Toggle Logic ---
    // This part should be consistent with the HTML's data-visible attribute
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', String(!isExpanded)); // Set as string
            navMenu.setAttribute('data-visible', String(!isExpanded)); // Set as string
        });
    }

    // --- Clerk Integration and Smart Header Logic ---
    const Clerk = window.Clerk; // Access global Clerk object if already defined

    // This function physically changes the header elements based on login state
    function updateHeader(ClerkInstance) {
        const user = ClerkInstance.user;
        const navList = document.querySelector('.nav-menu ul'); // Corrected selector
        const loginLink = document.querySelector('.nav-menu ul li a[href*="sign-in.html"]'); // Select specific login link
        const signupButton = document.querySelector('a.cta-button[href*="sign-up.html"]');
        const currentLanguage = document.documentElement.lang;

        // Ensure we have the necessary elements before proceeding
        if (!navList || !signupButton) {
            console.warn("Missing critical header elements for Clerk integration.");
            return;
        }

        if (user) {
            // --- User is logged in ---

            // 1. Remove "Login" link if it exists
            if (loginLink && loginLink.parentElement) { // Check parent exists before removing
                loginLink.parentElement.remove();
            }

            // 2. Add/Ensure "My Account" link
            const existingAccountLink = document.querySelector('.nav-menu ul li a[href*="account-dashboard.html"]');
            if (!existingAccountLink) {
                const myAccountItem = document.createElement('li');
                const myAccountLink = document.createElement('a');
                myAccountLink.textContent = 'My Account';
                myAccountLink.href = currentLanguage === 'en' ? '/en/account-dashboard.html' : '/pt-br/account-dashboard.html';
                myAccountLink.classList.add('nav-link'); // Add nav-link class for styling
                myAccountItem.appendChild(myAccountLink);
                navList.appendChild(myAccountItem);
            } else {
                // Ensure the existing account link has the correct text for the current language
                existingAccountLink.textContent = currentLanguage === 'en' ? 'My Account' : 'Minha Conta';
            }


            // 3. Replace "Sign Up" button with Clerk User Button
            let userButtonContainer = document.getElementById('clerk-user-button-container');
            if (!userButtonContainer) {
                userButtonContainer = document.createElement('div');
                userButtonContainer.id = 'clerk-user-button-container';
                // To maintain styling, maybe wrap it in a div that mimics cta-button's margin/position
                // For now, we'll replace the signup button directly.
                signupButton.parentNode.replaceChild(userButtonContainer, signupButton);
            }
            // Only mount if not already mounted (Clerk handles this somewhat, but explicit check helps)
            // Note: Clerk.userButtonMounted() is not a public API. Rely on Clerk's internal checks or a flag.
            // For simplicity, Clerk.mountUserButton will generally handle re-mounting safely.
            ClerkInstance.mountUserButton(userButtonContainer);

        } else {
            // --- User is logged out ---
            // Ensure login/signup links are present and user button is unmounted

            // 1. Ensure "Login" link exists
            const existingLoginLink = document.querySelector('.nav-menu ul li a[href*="sign-in.html"]');
            if (!existingLoginLink) {
                const loginItem = document.createElement('li');
                const loginLinkElement = document.createElement('a');
                loginLinkElement.textContent = currentLanguage === 'en' ? 'Login' : 'Entrar';
                loginLinkElement.href = currentLanguage === 'en' ? '/en/sign-in.html' : '/pt-br/sign-in.html';
                loginLinkElement.classList.add('nav-link');
                loginItem.appendChild(loginLinkElement);
                // Prepend to navList or insert before other specific elements
                // For simplicity, let's add it at the end if not found
                navList.appendChild(loginItem);
            }

            // 2. Ensure "Sign Up" button exists
            let currentSignupButton = document.querySelector('a.cta-button[href*="sign-up.html"]');
            const userButtonContainer = document.getElementById('clerk-user-button-container');

            if (userButtonContainer && userButtonContainer.parentNode) {
                // If Clerk User Button was mounted, unmount it and put the signup button back
                ClerkInstance.unmountUserButton(userButtonContainer);
                if (!currentSignupButton) { // Only re-create if it truly doesn't exist
                    const newSignupButton = document.createElement('a');
                    newSignupButton.textContent = currentLanguage === 'en' ? 'Sign Up' : 'Inscreva-se';
                    newSignupButton.href = currentLanguage === 'en' ? '/en/sign-up.html' : '/pt-br/sign-up.html';
                    newSignupButton.classList.add('cta-button'); // Re-add class for styling
                    // Insert where the user button container was
                    userButtonContainer.parentNode.replaceChild(newSignupButton, userButtonContainer);
                }
            } else if (!currentSignupButton) {
                // If no user button container and no signup button (initial state or error), add signup
                const newSignupButton = document.createElement('a');
                newSignupButton.textContent = currentLanguage === 'en' ? 'Sign Up' : 'Inscreva-se';
                newSignupButton.href = currentLanguage === 'en' ? '/en/sign-up.html' : '/pt-br/sign-up.html';
                newSignupButton.classList.add('cta-button');
                navList.parentNode.appendChild(newSignupButton); // Append to parent of navList if no specific spot
            }


            // 3. Remove "My Account" link if it exists (if logging out from an account dashboard page)
            const myAccountLink = document.querySelector('.nav-menu ul li a[href*="account-dashboard.html"]');
            if (myAccountLink && myAccountLink.parentElement) {
                myAccountLink.parentElement.remove();
            }
        }
    }

    // Main function to setup Clerk, called after Clerk script is loaded
    async function initializeClerkAndHeader() {
        if (!window.Clerk) {
            console.error("Clerk object not found. Clerk.js might not have loaded correctly.");
            return;
        }

        try {
            await window.Clerk.load(); // Use window.Clerk to be explicit
            updateHeader(window.Clerk);

            // Add an event listener to update the header whenever the user logs in or out
            window.Clerk.addListener(({ user }) => {
                updateHeader(window.Clerk);
            });
        } catch (err) {
            console.error("Clerk initialization error:", err);
            // Optionally, show a fallback UI or redirect
        }
    }

    // Dynamically load Clerk.js
    function loadClerkScript() {
        if (document.getElementById('clerk-script')) {
            // Script already exists, do nothing
            return;
        }

        const script = document.createElement("script");
        script.id = "clerk-script"; // Add an ID to prevent duplicate loading
        script.setAttribute("data-clerk-publishable-key", CLERK_PUBLISHABLE_KEY);
        script.async = true;
        script.defer = true; // Use defer as well for better performance
        script.src = CLERK_SCRIPT_URL;
        script.addEventListener("load", initializeClerkAndHeader);
        script.addEventListener("error", () => {
            console.error("Failed to load Clerk.js script.");
        });
        document.head.appendChild(script); // Append to head for better practice
    }

    // Initial call to load Clerk
    loadClerkScript();

    // --- Smooth Scrolling for Internal Links ---
    // This was added in the previous HTML inline script, but it's better to manage it here
    document.querySelectorAll('a[href^="/en/#"], a[href^="/pt-br/#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // Close mobile nav after click on a hash link
            if (navMenu && navMenu.getAttribute('data-visible') === 'true') {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('data-visible', 'false');
            }
        });
    });

    // --- Active Navigation Link Highlighting ---
    // This was also added in the previous HTML inline script.
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu ul li a.nav-link');

    function highlightNavLink() {
        let current = '';
        // Offset to trigger highlight slightly before section reaches top
        const offset = window.innerHeight * 0.3; // 30% of viewport height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - offset) {
                current = section.getAttribute('id');
            }
        });

        // Handle the "Home" link if at the very top or above the first section
        if (pageYOffset < sections[0].offsetTop - offset) {
            current = 'hero'; // Assuming 'hero' corresponds to the home section
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check both data-section and if href is just '/' or '/en/' or '/pt-br/' for 'Home'
            const linkHref = link.getAttribute('href');
            if (link.getAttribute('data-section') === current ||
                (current === 'hero' && (linkHref === '/en/' || linkHref === '/pt-br/'))
            ) {
                link.classList.add('active');
            }
        });
    }

    // Add event listeners for scroll and initial load
    window.addEventListener('scroll', highlightNavLink);
    // Initial call to set active link on page load
    highlightNavLink();
});
