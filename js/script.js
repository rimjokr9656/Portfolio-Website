/* 
========================================================================
   RIMJO K. R - PORTFOLIO JAVASCRIPT (MAIN SCRIPT)
   Interactions, Form Validation, Active Nav State, and Lazy Loading
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Header Scroll Shadow Effect ---
    const header = document.querySelector('header');
    const checkHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Run once initially
    
    // --- 2. Mobile Nav Toggle Drawer ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== navToggle) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // --- 3. Active Menu Underline Sync via IntersectionObserver ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle portion of viewport
        threshold: 0
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${activeId}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));
    
    // --- 4. Contact Form Validation & Animated Success Feedback ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Gather inputs
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');
            const submitBtn = contactForm.querySelector('.btn-submit');
            
            let isValid = true;
            
            // Reset validation states
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                input.style.borderColor = 'var(--primary-color)';
            });
            
            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.style.borderColor = '#FF3B30';
                isValid = false;
            }
            
            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.style.borderColor = '#FF3B30';
                isValid = false;
            }
            
            // Validate Subject
            if (!subjectInput.value.trim()) {
                subjectInput.style.borderColor = '#FF3B30';
                isValid = false;
            }
            
            // Validate Message
            if (!messageInput.value.trim()) {
                messageInput.style.borderColor = '#FF3B30';
                isValid = false;
            }
            
            if (isValid) {
                // Change submit button state to simulating sending
                submitBtn.disabled = true;
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Redirecting to WhatsApp...';
                submitBtn.style.backgroundColor = 'var(--accent-color)';
                submitBtn.style.color = 'var(--primary-color)';
                
                // Format WhatsApp Message
                const phoneNumber = '918075647251'; // Country code 91 + phone number
                const messageText = `Hello Rimjo,

I saw your portfolio and would like to get in touch!

👤 Name: ${nameInput.value.trim()}
📧 Email: ${emailInput.value.trim()}
📝 Subject: ${subjectInput.value.trim()}

💬 Message:
${messageInput.value.trim()}`;

                const encodedText = encodeURIComponent(messageText);
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
                
                // Simulate small delay for polished UI feel, then redirect
                setTimeout(() => {
                    // Open WhatsApp link in a new tab
                    window.open(whatsappUrl, '_blank');
                    
                    // Show success feedback
                    submitBtn.innerText = 'Sent to WhatsApp ✓';
                    submitBtn.style.backgroundColor = '#34C759';
                    submitBtn.style.color = '#FFFFFF';
                    submitBtn.style.borderColor = '#34C759';
                    
                    // Reset form fields
                    contactForm.reset();
                    
                    // Re-enable button after 3 seconds
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                        submitBtn.style.backgroundColor = 'var(--primary-color)';
                        submitBtn.style.color = '#FFFFFF';
                        submitBtn.style.borderColor = 'var(--primary-color)';
                    }, 3000);
                    
                }, 1000);
            }
        });
    }

    // --- 5. Pure CSS Fallback Animations observer (if GSAP fails/slows) ---
    const animatedElements = document.querySelectorAll('.css-fade-up');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => animationObserver.observe(element));
    
    // --- 6. Tool progress bar animator (if GSAP fails/slows) ---
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    const skillsSection = document.getElementById('skills');
    
    if (skillsSection && progressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => {
                        const targetVal = bar.getAttribute('data-progress');
                        bar.style.width = `${targetVal}%`;
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        skillsObserver.observe(skillsSection);
    }
});
