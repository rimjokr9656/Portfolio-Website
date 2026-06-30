/* 
========================================================================
   RIMJO K. R - PORTFOLIO JAVASCRIPT (CUSTOM CURSOR)
   Double-element Lag Follower Custom Cursor with hover scaling
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Create cursor elements dynamically so HTML remains clean
    const cursorDot = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursorDot.className = 'custom-cursor';
    cursorFollower.className = 'custom-cursor-follower';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorFollower);
    
    // Mouse coordinates
    let mouseX = 0;
    let mouseY = 0;
    
    // Cursor coordinates (lag position)
    let dotX = 0;
    let dotY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Lerp factor (linear interpolation) for smooth lag effect
    const dotSpeed = 1.0; // Instant
    const followerSpeed = 0.15; // Slow follow
    
    let isHidden = true;
    
    // Hide initially
    cursorDot.style.opacity = 0;
    cursorFollower.style.opacity = 0;
    
    // 2. Track mouse move
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (isHidden) {
            cursorDot.style.opacity = 1;
            cursorFollower.style.opacity = 1;
            isHidden = false;
        }
    });
    
    // 3. Smooth animation loop
    function updateCursor() {
        // Linear interpolation formula: current = current + (target - current) * speed
        dotX += (mouseX - dotX) * dotSpeed;
        dotY += (mouseY - dotY) * dotSpeed;
        
        followerX += (mouseX - followerX) * followerSpeed;
        followerY += (mouseY - followerY) * followerSpeed;
        
        // Apply transform translates
        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
    
    // 4. Hide when cursor leaves window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = 0;
        cursorFollower.style.opacity = 0;
        isHidden = true;
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = 1;
        cursorFollower.style.opacity = 1;
        isHidden = false;
    });
    
    // 5. Add Hover interactions
    const interactiveElements = 'a, button, input, textarea, .card, .btn, .social-circle, .nav-toggle, .journey-content, .edu-content';
    
    function addCursorHoverListeners() {
        const hoverTargets = document.querySelectorAll(interactiveElements);
        
        hoverTargets.forEach(target => {
            // Mouse Enter
            target.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovered');
                cursorFollower.classList.add('hovered');
            });
            
            // Mouse Leave
            target.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovered');
                cursorFollower.classList.remove('hovered');
            });
        });
    }
    
    // Initialize hover listeners
    addCursorHoverListeners();
    
    // Re-run if DOM changes (e.g. dynamic elements added later)
    const observer = new MutationObserver(addCursorHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
});
