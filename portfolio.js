// Portfolio Page Logic for JAFFA GROUP

// 1. Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// 3. GSAP Animations
gsap.registerPlugin(ScrollTrigger);

const initAnimations = () => {
    // Hero Entrance
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 }});
    tl.to('.hero-bg img', { scale: 1.1, duration: 2.5 }, 0)
      .from('.portfolio-tagline .line span', { y: 100, opacity: 0, stagger: 0.15 }, 0.5);

    // Image Parallax
    document.querySelectorAll('.portfolio-card').forEach(card => {
        const img = card.querySelector('img');
        gsap.fromTo(img, { yPercent: 15 }, {
            yPercent: -15,
            scrollTrigger: {
                trigger: card,
                scrub: true,
                start: "top bottom",
                end: "bottom top"
            }
        });
    });

    // Modal Interactions
    const modalTl = gsap.timeline({ paused: true });
    
    // Animate Modal Entrance
    modalTl.to('#project-modal', { 
        x: '0%', 
        visibility: 'visible', 
        duration: 1.2, 
        ease: 'power4.inOut' 
    })
    .from('.modal-nav-item', { 
        x: 50, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 0.8, 
        ease: 'power3.out' 
    }, '-=0.4');

    const openModal = () => {
        lenis.stop();
        modalTl.play();
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        lenis.start();
        gsap.to('#project-modal', { 
            x: '100%', 
            duration: 0.8, 
            ease: 'power4.in', 
            onComplete: () => {
                gsap.set('#project-modal', { visibility: 'hidden' });
                modalTl.pause(0);
                document.body.style.overflow = '';
            }
        });
    };

    // Event Listeners for Modal
    document.querySelector('.open-modal-trigger').addEventListener('click', openModal);
    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);

    // Click outside to close (optional but nice)
    document.querySelector('#project-modal').addEventListener('click', (e) => {
        if (e.target === document.querySelector('#project-modal')) {
            closeModal();
        }
    });

    // Hover Crossfade in Modal
    const modalNavItems = document.querySelectorAll('.modal-nav-item');
    const modalMainImg = document.querySelector('#modal-main-img');

    modalNavItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Update active state
            modalNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Image crossfade
            const newSrc = item.dataset.img;
            if (modalMainImg.src === newSrc) return;

            gsap.to(modalMainImg, { 
                opacity: 0, 
                duration: 0.3, 
                onComplete: () => {
                    modalMainImg.src = newSrc;
                    gsap.to(modalMainImg, { opacity: 1, duration: 0.6 });
                }
            });
        });
    });
    // 4. Project Transition Logic (The "Expansion" & "Shrink" Effect)
    const projectBtns = document.querySelectorAll('.view-project-btn');
    const overlay = document.querySelector('.expansion-overlay');
    const overlayText = document.querySelector('.expansion-text');
    const mainContent = document.querySelector('.portfolio-main-content');

    if (overlay && overlayText && mainContent) {
        // 4a. Handle Returning from Project Page ("Shrink" Animation)
        const isReturning = sessionStorage.getItem('returningFromProject');
        const savedRectStr = sessionStorage.getItem('lastCardRect');
        const savedScrollStr = sessionStorage.getItem('portfolioScroll');

        if (isReturning === 'true' && savedRectStr) {
            // Clear flag
            sessionStorage.removeItem('returningFromProject');
            
            // Restore scroll position instantly
            if (savedScrollStr) {
                window.scrollTo(0, parseInt(savedScrollStr, 10));
            }

            const savedRect = JSON.parse(savedRectStr);
            const savedTitle = sessionStorage.getItem('lastCardTitle');
            const savedImgSrc = sessionStorage.getItem('lastCardImg');

            // Setup Overlay at Full Screen (Hero Size)
            overlay.innerHTML = `<img src="${savedImgSrc}" alt="Project">`;
            overlayText.innerHTML = savedTitle;

            gsap.set(overlay, {
                top: 0,
                left: 0,
                width: window.innerWidth + 'px',
                height: window.innerHeight + 'px',
                display: 'block',
                borderRadius: 0
            });

            // Text expansion removed as requested

            // Hide main content initially to fade it in
            gsap.set(mainContent, { opacity: 0 });
            mainContent.classList.remove('fade-out');

            lenis.stop();

            // Animate down to saved rect
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(overlay, { display: 'none' });
                    gsap.set(overlayText, { display: 'none' });
                    lenis.start();
                }
            });

            tl.to(overlay, {
                top: savedRect.img.top,
                left: savedRect.img.left,
                width: savedRect.img.width,
                height: savedRect.img.height,
                borderRadius: '4px',
                duration: 1.2,
                ease: 'power4.inOut'
            }, 0)

            .to(mainContent, {
                opacity: 1,
                duration: 1.0,
                ease: 'power2.inOut'
            }, 0.2); // Fade in main content slightly delayed
        }

        // 4b. Handle Forward Click ("Expand" Animation - REFINED)
        projectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const href = btn.getAttribute('href');
                if (!href || href === '#') return;

                e.preventDefault();

                const card = btn.closest('.portfolio-card');
                const cardImg = card.querySelector('img');
                const cardTitle = card.querySelector('h3');
                
                // 1. Get initial positions
                const imgRect = cardImg.getBoundingClientRect();
                const titleRect = cardTitle.getBoundingClientRect();

                // Save to sessionStorage for the "Back" animation
                sessionStorage.setItem('portfolioScroll', window.scrollY);
                sessionStorage.setItem('lastCardRect', JSON.stringify({
                    img: { top: imgRect.top, left: imgRect.left, width: imgRect.width, height: imgRect.height },
                    title: { top: titleRect.top, left: titleRect.left, width: titleRect.width }
                }));
                sessionStorage.setItem('lastCardTitle', cardTitle.innerHTML);
                sessionStorage.setItem('lastCardImg', cardImg.src);

                // 2. Prepare Overlay
                overlay.innerHTML = `<img src="${cardImg.src}" alt="${cardImg.alt}">`;
                overlayText.innerHTML = cardTitle.innerHTML;

                gsap.set(overlay, {
                    top: imgRect.top,
                    left: imgRect.left,
                    width: imgRect.width,
                    height: imgRect.height,
                    display: 'block',
                    borderRadius: '4px'
                });

                // Text expansion removed as requested

                // 3. Start Animation
                lenis.stop();
                
                const tl = gsap.timeline({
                    onComplete: () => {
                        window.location.href = href;
                    }
                });

                // Fade out main content smoothly
                tl.to(mainContent, {
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.inOut'
                }, 0);

                tl.to(overlay, {
                    top: 0,
                    left: 0,
                    width: window.innerWidth + 'px',
                    height: window.innerHeight + 'px',
                    borderRadius: 0,
                    duration: 1.2, // More dramatic duration
                    ease: 'expo.inOut' // Premium architectural deceleration
                }, 0);
            });
        });
    }
};

window.addEventListener('DOMContentLoaded', initAnimations);

// Fallback to prevent stuck states if browser uses Back/Forward Cache
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // The page was restored exactly as it was when the user left (expanded state).
        // Best approach is to strictly reload it to ensure a clean animation canvas.
        window.location.reload();
    }
});

