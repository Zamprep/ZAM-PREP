const clerkPublishableKey = "pk_test_ZGlzdGluY3QtYW50LTMyLmNsZXJrLmFjY291bnRzLmRldiQ";

function initClerk() {
    const clerk = new window.Clerk(clerkPublishableKey);

    clerk.load()
        .then(() => {
            const userButton = document.getElementById("user-button");
            const authLinks = document.getElementById("auth-links");

            if (!userButton || !authLinks) {
                console.warn("Clerk handler: Auth elements not found on this page.");
                return;
            }

            clerk.addListener(({ user }) => {
                if (user) {
                    // User is signed in
                    authLinks.style.display = "none";
                    userButton.style.display = "block";
                    clerk.mountUserButton(userButton, { afterSignOutUrl: '/' });
                } else {
                    // User is signed out
                    authLinks.style.display = "flex"; // Use 'flex' to align items
                    userButton.style.display = "none";
                }
            });
        })
        .catch(error => {
            console.error("Clerk initialization error:", error);
        });
}

// Load the Clerk.js script programmatically
const script = document.createElement('script');
script.setAttribute('data-clerk-publishable-key', clerkPublishableKey);
script.src = 'https://distinct-ant-32.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
script.async = true;
script.onload = () => initClerk();
document.head.appendChild(script);