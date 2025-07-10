// This function will run after the page has loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Logic for Language Dropdown ---
    const langButton = document.querySelector('.language-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (langButton) {
        langButton.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (langButton && !langButton.contains(event.target)) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    }

    // --- New Logic for Smart Header ---
    const publishableKey = "pk_test_bW9yYWwtYm9hLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
    
    // Function to update header based on login state
    const updateHeader = () => {
        const Clerk = window.Clerk;
        const user = Clerk.user;
        
        // Find the navigation elements
        const loginLink = document.querySelector('a[href*="sign-in.html"]');
        const signupButton = document.querySelector('a.cta-button[href*="sign-up.html"]');
        
        if (user) {
            // User is logged in
            if (loginLink) {
                loginLink.textContent = 'My Account';
                // Check if we are on the english or portuguese page to set the correct dashboard link
                if (document.documentElement.lang === 'en') {
                    loginLink.href = '/en/account-dashboard.html';
                } else {
                    loginLink.href = '/pt-br/account-dashboard.html';
                }
            }
            if (signupButton) {
                // Create a div for the user button and replace the sign up button
                const userButtonContainer = document.createElement('div');
                userButtonContainer.id = 'user-button';
                signupButton.parentNode.replaceChild(userButtonContainer, signupButton);
                Clerk.mountUserButton(userButtonContainer);
            }
        }
        // If user is not logged in, the default HTML links for "Login" and "Sign Up" will show, so we don't need to do anything.
    };

    // Load the Clerk script and then update the header
    const script = document.createElement("script");
    script.setAttribute("data-clerk-publishable-key", publishableKey);
    script.async = true;
    script.src = `https://moral-boa-38.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
    
    script.addEventListener("load", async () => {
        const Clerk = window.Clerk;
        try {
            await Clerk.load();
            updateHeader(); // Call the function to update the header
        } catch (err) {
            console.error("Clerk Error:", err);
        }
    });
    document.body.appendChild(script);
});