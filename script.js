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
            if (dropdownContent && dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    }

    // --- Logic for Smart Header ---
    const publishableKey = "pk_test_bW9yYWwtYm9hLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
    
    const Clerk = window.Clerk;

    // This function runs after Clerk is fully ready
    async function setupClerk() {
        if (!Clerk) {
            return;
        }
        
        try {
            await Clerk.load();
            updateHeader(Clerk); // Update the header based on login state
            
            // Add an event listener to update the header whenever the user logs in or out
            Clerk.addListener(({ user }) => {
                updateHeader(Clerk);
            });

        } catch (err) {
            console.error("Clerk Error:", err);
        }
    }

    // This function physically changes the header elements
    function updateHeader(Clerk) {
        const user = Clerk.user;
        
        // Find the navigation list and the signup button
        const navList = document.querySelector('.desktop-nav ul');
        const signupButton = document.querySelector('a.cta-button[href*="sign-up.html"]');

        if (user && navList && signupButton) {
            // --- User is logged in ---

            // Check if "My Account" link already exists to prevent duplication
            if (!document.querySelector('a[href*="account-dashboard.html"]')) {
                // Find and remove the old "Login" link if it exists
                const loginLink = document.querySelector('a[href*="sign-in.html"]');
                if (loginLink) {
                    loginLink.parentElement.remove();
                }

                // Create the "My Account" link
                const myAccountItem = document.createElement('li');
                const myAccountLink = document.createElement('a');
                myAccountLink.textContent = 'My Account';
                // Set link based on current page language
                myAccountLink.href = document.documentElement.lang === 'en' ? '/en/account-dashboard.html' : '/pt-br/account-dashboard.html';
                myAccountItem.appendChild(myAccountLink);
                navList.appendChild(myAccountItem);
            }

            // Replace the "Sign Up" button with the Clerk User Button
            if (signupButton.id !== 'user-button-container') {
                const userButtonContainer = document.createElement('div');
                userButtonContainer.id = 'user-button-container';
                signupButton.parentNode.replaceChild(userButtonContainer, signupButton);
                Clerk.mountUserButton(userButtonContainer);
            }
        }
    }

    // Load the Clerk script and call the setup function when it's ready
    const script = document.createElement("script");
    script.setAttribute("data-clerk-publishable-key", publishableKey);
    script.async = true;
    script.src = `https://moral-boa-38.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
    script.addEventListener("load", setupClerk);
    document.body.appendChild(script);
});