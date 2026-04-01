document.addEventListener('DOMContentLoaded', () => {

    // 1. Custom Cursor and Glassy Background Animation
    const cursor = document.querySelector('.custom-cursor');
    const blob = document.querySelector('.interactive-bg .blob');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = window.innerWidth / 2;
    let blobY = window.innerHeight / 2;

    if(window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Real-time custom cursor follow
            requestAnimationFrame(() => {
                if(cursor) {
                    cursor.style.left = `${mouseX}px`;
                    cursor.style.top = `${mouseY}px`;
                }
            });
        });

        // Lerp animation loop for the background blob
        const updateBlob = () => {
            // Lerp factor
            blobX += (mouseX - blobX) * 0.05;
            blobY += (mouseY - blobY) * 0.05;

            if(blob) {
                blob.style.left = `${blobX}px`;
                blob.style.top = `${blobY}px`;
            }

            requestAnimationFrame(updateBlob);
        };
        
        updateBlob();
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class to trigger CSS transition
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
            // Optional: Remove class when not in view (for repeating animations on scroll)
            // else { entry.target.classList.remove('is-visible'); }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => animateOnScrollObserver.observe(el));


    // 5. 3D Tilt Effect for Service Cards
    // Using vanilla JS to calculate mouse position relative to element
    const cards = document.querySelectorAll('[data-tilt]');
    
    // Only active on desktop
    if(window.matchMedia("(pointer: fine)").matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                // Get mouse position relative to element center
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Calculate rotation (max rotation is roughly 15 degrees)
                const rotateX = -y / (rect.height / 2) * 15;
                const rotateY = x / (rect.width / 2) * 15;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            // Reset rotation when mouse leaves
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });

            // Remove transition quickly on mouseenter for snappier follow
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s linear';
            });
        });
    }

    // 6. Form Submission Prevention (for demo purposes)
    const form = document.querySelector('.contact-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="ph ph-check-circle"></i> Sent Successfully';
            btn.style.background = 'linear-gradient(45deg, #00e5ff, #8a2be2)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    }

    // 7. Hero Scroll Zoom & Parallax Animation
    const heroContent = document.querySelector('.hero-content');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Only run animation if we are within the first screen height
                if (lastScrollY <= window.innerHeight) {
                    // Parallax: scroll down slower than the page
                    const yPos = lastScrollY * 0.4;
                    // Zoom: scale up from 1x to 1.4x
                    const scale = 1 + (lastScrollY / window.innerHeight) * 0.4;
                    // Fade out
                    const opacity = 1 - (lastScrollY / (window.innerHeight * 0.6));
                    
                    if(heroContent) {
                        heroContent.style.transform = `translateY(${yPos}px) scale(${scale})`;
                        heroContent.style.opacity = Math.max(0, opacity);
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // 8. Lenis High-Fidelity Smooth Scroll (Applies momentum inertia to vertical scrolling)
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function rafScroller(time) {
            lenis.raf(time);
            requestAnimationFrame(rafScroller);
        }
        requestAnimationFrame(rafScroller);
    }
});
