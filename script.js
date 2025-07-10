document.addEventListener('DOMContentLoaded', function() {

    // This is the single ID we will use for all authentication forms
    const CLERK_MOUNT_POINT_ID = 'clerk-auth-form';

    // This function will be called by the script tag's onload event
    window.startClerk = async function() {
        const Clerk = window.Clerk;
        const mountPoint = document.getElementById(CLERK_MOUNT_POINT_ID);

        if (!Clerk || !mountPoint) {
            // If Clerk or the mount point doesn't exist, do nothing.
            return;
        }

        try {
            await Clerk.load();

            const path = window.location.pathname;
            const pageLang = document.documentElement.lang || 'en';

            // Hide the loading spinner and show the component container
            const spinner = document.getElementById('loading-spinner');
            if (spinner) spinner.style.display = 'none';
            mountPoint.style.display = 'block';

            // Mount the correct component based on the URL
            if (path.includes('/sign-in')) {
                Clerk.mountSignIn(mountPoint);
            } else if (path.includes('/sign-up')) {
                const redirectUrl = pageLang.startsWith('en') ? '/en/onboarding.html' : '/pt-br/onboarding.html';
                Clerk.mountSignUp(mountPoint, { afterSignUpUrl: redirectUrl });
            }

        } catch (err) {
            console.error("Clerk Error:", err);
            mountPoint.innerHTML = "Failed to load authentication form. Please try again.";
        }
    };

    // This section is for the dynamic header on non-auth pages
    // It will run separately after Clerk is loaded
    async function initializeHeader() {
        const Clerk = window.Clerk;
        if (!Clerk) return;

        await Clerk.load();
        updateHeader(Clerk);
        Clerk.addListener(() => updateHeader(Clerk));
    }

    function updateHeader(Clerk) {
        const user = Clerk.user;
        const loginLinkListItem = document.querySelector('a[href*="sign-in.html"]')?.parentElement;
        const signupButton = document.querySelector('a.cta-button[href*="sign-up.html"]');
        if (!loginLinkListItem || !signupButton) return; // Only run on main homepage

        if (user) {
            loginLinkListItem.innerHTML = `<a href="/en/account-dashboard.html">My Account</a>`;
            const userButtonContainer = document.createElement('div');
            userButtonContainer.id = 'user-button-container';
            signupButton.replaceWith(userButtonContainer);
            Clerk.mountUserButton(userButtonContainer);
        }
    }

    // Check if we are on an auth page or not
    if (document.getElementById(CLERK_MOUNT_POINT_ID)) {
        // We are on an auth page, just load Clerk
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://moral-boa-38.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
        script.setAttribute("data-clerk-publishable-key", "pk_test_bW9yYWwtYm9hLTM4LmNsZXJrLmFjY291bnRzLmRldiQ");
        script.addEventListener("load", window.startClerk);
        document.head.appendChild(script);
    } else {
        // We are on a different page (like the homepage), so initialize the header logic
        // The script from the HTML pages should handle loading, but this is a fallback.
        // In this final version, we will let the HTML handle all script loading.
    }
});