/* 
========================================================================
   RIMJO K. R - PORTFOLIO JAVASCRIPT (GSAP ANIMATIONS)
   ScrollTriggers, Counters, Parallax and Magnetic Interactions
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Register ScrollTrigger ---
    // If loaded from CDN, GSAP and ScrollTrigger are global objects
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger is not loaded. Falling back to CSS transitions.');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. Hero Initial Load Animations ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    heroTl.from('.logo', { y: -20, opacity: 0, delay: 0.2 })
          .from('.nav-toggle', { y: -20, opacity: 0 }, '-=0.8')
          .from('.hero-badge', { scale: 0.8, opacity: 0 }, '-=0.6')
          .from('.mobile-hero-banner', { scale: 0.95, opacity: 0, duration: 1.2 }, '-=0.8')
          .from('.hero-title span', { y: 100, opacity: 0, stagger: 0.1, duration: 1.2 }, '-=0.8')
          .from('.hero-subtitle', { y: 20, opacity: 0 }, '-=0.8')
          .from('.hero-description', { y: 20, opacity: 0 }, '-=0.8')
          .from('.hero-buttons .btn', { y: 20, opacity: 0, stagger: 0.15 }, '-=0.8')
          .from('.portrait-bg-card', { x: 50, y: 50, opacity: 0 }, '-=1.2')
          .from('.portrait-img', { scale: 1.1, opacity: 0 }, '-=1.0')
          .from('.portrait-outline-circle', { scale: 0.8, opacity: 0, rotate: -45 }, '-=1.0')
          .from('.floating-doodle', { scale: 0, opacity: 0, stagger: 0.15 }, '-=0.8')
          .from('.scroll-indicator', { y: 10, opacity: 0, repeat: -1, yoyo: true, duration: 0.8 }, '-=0.4');

    // --- 3. Scroll Reveal for Sections ---
    const revealSections = document.querySelectorAll('section:not(#home):not(#experience):not(#skills)');
    
    revealSections.forEach(section => {
        const title = section.querySelector('h2');
        const cards = section.querySelectorAll('.card-lift, .experience-card, .journey-item, .skill-card, .edu-item, .why-card');
        const divider = section.querySelector('.divider');
        
        const sectionTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%', // trigger animation when top of section is 75% down the viewport
                toggleActions: 'play none none none'
            }
        });
        
        if (title) {
            sectionTl.from(title, { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' });
        }
        
        if (divider) {
            sectionTl.from(divider, { scaleX: 0, transformOrigin: 'left center', duration: 0.6 }, '-=0.4');
        }
        
        if (cards.length > 0) {
            sectionTl.from(cards, {
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.5');
        }
    });


    // --- 5. Achievements Animated Counters ---
    const counters = document.querySelectorAll('.counter-val');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
        
        const countObj = { val: 0 };
        
        gsap.to(countObj, {
            val: target,
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                counter.innerText = prefix + countObj.val.toFixed(decimals) + suffix;
            }
        });
    });


    // --- 7. Magnetic Button/Icons Hover Effect ---
    const magneticBtns = document.querySelectorAll('.btn, .social-circle, .logo');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const bounding = btn.getBoundingClientRect();
            // Calculate cursor offset from center of button
            const x = e.clientX - bounding.left - bounding.width / 2;
            const y = e.clientY - bounding.top - bounding.height / 2;
            
            // Move button slightly (magnetic pull factor = 0.35)
            gsap.to(btn, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            // Restore original position instantly on mouse leave
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- 8. Mouse-Move Parallax for Floating Hero Doodles ---
    const heroArea = document.getElementById('home');
    const doodles = document.querySelectorAll('.floating-doodle');
    
    if (heroArea) {
        heroArea.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            // Calculate normalized mouse positions (-0.5 to 0.5)
            const normX = (e.clientX / width) - 0.5;
            const normY = (e.clientY / height) - 0.5;
            
            doodles.forEach((doodle, index) => {
                // Different parallax coefficients based on index
                const depth = (index + 1) * 15;
                gsap.to(doodle, {
                    x: normX * depth,
                    y: normY * depth,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }
});
