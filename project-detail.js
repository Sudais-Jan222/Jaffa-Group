// Project Detail Page - Premium GSAP Animations & Smooth Scroll
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // 2. Initialize Animations
    initHeroAnimations();
    initImmersiveGallery();
    setupBackButton();

    // 3. Robustness Refresh
    [100, 500, 1000, 2000].forEach(delay => {
        setTimeout(() => ScrollTrigger.refresh(), delay);
    });
});

function initHeroAnimations() {
    gsap.to('.project-hero-overlay', {
        opacity: 1,
        duration: 1.8,
        ease: 'power2.inOut',
        delay: 0.5
    });

    gsap.to('.project-hero-content', {
        autoAlpha: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.8
    });
}

function initImmersiveGallery() {
    const masterContainer = document.querySelector('.gallery-master');
    const masterOverlay = document.querySelector('.master-overlay');
    const masterTitle = document.querySelector('#gallery-label-title');
    const thumbs = document.querySelectorAll('.thumb-item');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (!masterContainer || thumbs.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer;
    let isTransitioning = false;

    // ── Subtle text drift on scroll (no hiding) ──
    if (masterOverlay) {
        gsap.to(masterOverlay, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: masterContainer,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // ── Slide transition logic ──
    const updateGallery = (index, direction = 1) => {
        if (index === currentIndex || isTransitioning) return;
        isTransitioning = true;

        const oldIndex = currentIndex;
        currentIndex = index;

        // Update active thumb
        thumbs[oldIndex].classList.remove('active');
        thumbs[index].classList.add('active');
        thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        const nextSrc = thumbs[index].querySelector('img').src;
        const nextTitle = thumbs[index].dataset.title || 'Architectural Detail';

        // Create incoming image
        const oldImg = masterContainer.querySelector('.master-img');
        const newImg = document.createElement('img');
        newImg.src = nextSrc;
        newImg.className = 'master-img incoming';
        masterContainer.appendChild(newImg);

        const startX = direction > 0 ? 100 : -100;
        gsap.set(newImg, { xPercent: startX, scale: 1.05 });

        const tl = gsap.timeline({
            onComplete: () => {
                if (oldImg) masterContainer.removeChild(oldImg);
                newImg.classList.remove('incoming');
                isTransitioning = false;
            }
        });

        tl.to(oldImg, {
            xPercent: -startX * 0.4,
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: 'expo.inOut'
        }, 0)
        .to(newImg, {
            xPercent: 0,
            scale: 1,
            duration: 1.2,
            ease: 'expo.inOut'
        }, 0)
        .to(masterTitle, {
            opacity: 0,
            x: direction > 0 ? -15 : 15,
            duration: 0.4,
            ease: 'power2.in'
        }, 0)
        .add(() => { masterTitle.textContent = nextTitle; }, 0.5)
        .to(masterTitle, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, 0.6);

        resetAutoplay();
    };

    const nextImage = () => updateGallery((currentIndex + 1) % thumbs.length, 1);
    const prevImage = () => updateGallery((currentIndex - 1 + thumbs.length) % thumbs.length, -1);

    const startAutoplay = () => { autoplayTimer = setInterval(nextImage, 6000); };
    const resetAutoplay = () => { clearInterval(autoplayTimer); startAutoplay(); };

    // ── Event listeners ──
    thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
            updateGallery(idx, idx > currentIndex ? 1 : -1);
        });
    });

    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    startAutoplay();

    masterContainer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    masterContainer.addEventListener('mouseleave', startAutoplay);
}

function setupBackButton() {
    const backBtn = document.querySelector('.nav-cta-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('returningFromProject', 'true');
            window.location.href = backBtn.getAttribute('href');
        });
    }
}
