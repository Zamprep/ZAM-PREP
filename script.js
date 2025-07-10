document.addEventListener('DOMContentLoaded', function() {
    
    // --- Global Clerk Configuration ---
    const CLERK_PUBLISHABLE_KEY = "pk_test_bW9yYWwtYm9hLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
    const CLERK_SCRIPT_URL = `https://moral-boa-38.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
    
    // This function will be called by the script tag once it's loaded
    window.startClerk = async function() {
        const Clerk = window.Clerk;
        if (!Clerk) {
            console.error("Clerk object not found.");
            return;
        }

        try {
            await Clerk.load();
            
            const path = window.location.pathname;
            const mountPoint = document.getElementById('clerk-component');

            if (mountPoint) {
                // Hide spinner and show the component container
                const spinner = document.getElementById('loading-spinner');
                if(spinner) spinner.style.display = 'none';
                mountPoint.style.display = 'block';

                if (path.includes('/sign-in')) {
                    Clerk.mountSignIn(mountPoint);
                } else if (path.includes('/sign-up')) {
                    const pageLang = document.documentElement.lang || 'en';
                    const redirectUrl = pageLang.startsWith('en') ? '/en/onboarding.html' : '/pt-br/onboarding.html';
                    Clerk.mountSignUp(mountPoint, { afterSignUpUrl: redirectUrl });
                }
            }
        } catch (err) {
            console.error("Clerk Error:", err);
        }
    }

    // --- Load Clerk Script ---
    // Check if the script is already on the page
    if (!document.querySelector(`script[src="${CLERK_SCRIPT_URL}"]`)) {
        const script = document.createElement("script");
        script.setAttribute("data-clerk-publishable-key", CLERK_PUBLISHABLE_KEY);
        script.async = true;
        script.src = CLERK_SCRIPT_URL;
        script.addEventListener("load", window.startClerk);
        document.head.appendChild(script);
    }
});