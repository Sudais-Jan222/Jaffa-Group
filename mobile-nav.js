// --- Shared Mobile Hamburger Menu Toggle ---
(function () {
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    if (!hamburgerBtn || !mobileNavOverlay) return;

    hamburgerBtn.addEventListener('click', function () {
        var isOpen = hamburgerBtn.classList.toggle('open');
        mobileNavOverlay.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavOverlay.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburgerBtn.classList.remove('open');
            mobileNavOverlay.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
})();
