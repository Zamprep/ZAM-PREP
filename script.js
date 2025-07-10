document.addEventListener('DOMContentLoaded', function() {

    // --- Global Clerk Configuration ---
    const CLERK_PUBLISHABLE_KEY = "pk_test_bW9yYWwtYm9hLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
    const CLERK_SCRIPT_URL = `https://moral-boa-38.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;

    // --- Sitewide Menu Logic (Hamburger and Dropdown) ---
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
        document.addEventListener('click', (event) => {
            if (!langButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    // --- Clerk Initialization and Page-Specific Logic ---
    function initializeClerk() {
        const Clerk = window.Clerk;
        if (!Clerk) {
            console.error("Clerk.js not loaded.");
            return;
        }

        const path = window.location.pathname;

        const mountSignIn = () => {
            const container = document.getElementById('sign-in-container');
            if(container) Clerk.mountSignIn(container);
        };
        const mountSignUp = () => {
            const container = document.getElementById('sign-up-container');
            if(container) Clerk.mountSignUp(container, { redirectUrl: '/onboarding.html' });
        };
        const initializeOnboarding = () => {
            // Logic for onboarding.html (form submission, etc.) goes here
        };
        const initializeAccountDashboard = () => {
            const userButton = document.getElementById('user-button');
            if(userButton) Clerk.mountUserButton(userButton);
        };

        const protectPage = (redirectPath) => {
            if (!Clerk.user) {
                window.location.href = redirectPath;
            } else {
                // Show content if user is verified
                const content = document.querySelector('.content-wrapper');
                const spinner = document.getElementById('loading-spinner');
                if(content) content.style.display = 'block';
                if(spinner) spinner.style.display = 'none';
            }
        };
        
        Clerk.load().then(() => {
            // This runs on every page
            updateHeader(Clerk);
            Clerk.addListener(({ user }) => updateHeader(Clerk));

            // Run logic based on which page we are on
            if (path.includes('/sign-in.html')) {
                mountSignIn();
            } else if (path.includes('/sign-up.html')) {
                mountSignUp();
            } else if (path.includes('/account-dashboard.html')) {
                protectPage('/en/sign-in.html'); // Example redirect path
                initializeAccountDashboard();
            } else if (path.includes('/onboarding.html')) {
                protectPage('/en/sign-in.html');
                initializeOnboarding();
            }
        }).catch(error => {
            console.error("Clerk error:", error);
        });
    }
    
    function updateHeader(Clerk) {
        // The smart header logic we built previously
        const user = Clerk.user;
        const navList = document.querySelector('.nav-menu ul');
        const loginLink = document.querySelector('a[href*="sign-in.html"]');
        const signupButton = document.querySelector('a.cta-button');

        if (!navList) return; // Don't run on simplified auth headers

        if (user) {
            if(loginLink) loginLink.parentElement.innerHTML = `<a href="/en/account-dashboard.html">My Account</a>`;
            if(signupButton) {
                const userButtonContainer = document.createElement('div');
                userButtonContainer.id = 'user-button-container';
                signupButton.replaceWith(userButtonContainer);
                Clerk.mountUserButton(userButtonContainer);
            }
        }
    }

    // Load the Clerk script, then initialize everything
    const script = document.createElement("script");
    script.setAttribute("data-clerk-publishable-key", CLERK_PUBLISHABLE_KEY);
    script.async = true;
    script.src = CLERK_SCRIPT_URL;
    script.addEventListener("load", initializeClerk);
    document.head.appendChild(script);
});