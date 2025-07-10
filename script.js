document.addEventListener('DOMContentLoaded', function() {
    
    // This function checks the URL to decide which auth component to mount
    const mountClerkComponent = (clerk) => {
        const path = window.location.pathname;
        const mountPoint = document.getElementById('clerk-auth-form');
        if (!mountPoint) return;

        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'none';
        mountPoint.style.display = 'block';

        const pageLang = document.documentElement.lang || 'en';
        const onboardingUrl = pageLang.startsWith('en') ? '/en/onboarding.html' : '/pt-br/onboarding.html';

        if (path.includes('/sign-in')) {
            clerk.mountSignIn(mountPoint);
        } else if (path.includes('/sign-up')) {
            clerk.mountSignUp(mountPoint, { afterSignUpUrl: onboardingUrl });
        }
    };

    // This function handles the logic for protected pages like dashboards
    const handleProtectedPage = (clerk) => {
        const contentWrapper = document.querySelector('.content-wrapper');
        const spinner = document.getElementById('loading-spinner');
        const userButton = document.getElementById('user-button');

        if (!clerk.user) {
            const signInUrl = (document.documentElement.lang || 'en').startsWith('en') ? '/en/sign-in.html' : '/pt-br/sign-in.html';
            window.location.href = signInUrl;
        } else {
            if (spinner) spinner.style.display = 'none';
            if (contentWrapper) contentWrapper.style.display = 'block';
            if (userButton) clerk.mountUserButton(userButton);
        }
    };

    // --- Main Clerk Initialization ---
    const publishableKey = "pk_test_bW9yYWwtYm9hLTM4LmNsZXJrLmFjY291bnRzLmRldiQ";
    const clerk = new window.Clerk(publishableKey);

    clerk.load().then(() => {
        // Run the correct function based on the page's content
        if (document.getElementById('clerk-auth-form')) {
            mountClerkComponent(clerk);
        } else if (document.querySelector('.content-wrapper')) { // Assumes protected pages have this wrapper
            handleProtectedPage(clerk);
        }
    }).catch(error => {
        console.error("Clerk loading or mounting error:", error);
    });
});