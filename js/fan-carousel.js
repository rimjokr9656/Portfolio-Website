document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.fan-layout-wrapper');
    if (!track) return;
    
    const cards = Array.from(track.querySelectorAll('.fan-card'));
    const totalCards = cards.length;
    if (!totalCards) return;
    
    const leftArrow = document.querySelector('.fan-arrow.left');
    const rightArrow = document.querySelector('.fan-arrow.right');
    const dotsContainer = document.querySelector('.fan-dots');
    
    const MAX_VISIBLE = 7;
    const HALF = 3;
    
    // Set initial center index to the middle of the array
    const needsPagination = totalCards > MAX_VISIBLE;
    let centerIndex = needsPagination ? HALF : totalCards >> 1;
    let isAnimating = false;
    let direction = 'right';
    let previouslyVisible = new Set();
    
    // Create pagination dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('fan-dot');
        if (i === centerIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (isAnimating) return;
            goToIndex(i);
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('.fan-dot'));
    
    // Responsive scale values matching Next.js component multipliers
    function getResponsiveMultiplier() {
        const width = window.innerWidth;
        if (width < 480) return 0.28;
        if (width < 640) return 0.38;
        if (width < 768) return 0.50;
        if (width < 1024) return 0.75;
        return 1.0;
    }
    
    function getHeightMultiplier() {
        const width = window.innerWidth;
        let idealPx;
        if (width < 480) idealPx = 352;
        else if (width < 640) idealPx = 416;
        else if (width < 768) idealPx = 448;
        else if (width < 1024) idealPx = 544;
        else idealPx = 608;
        
        const available = window.innerHeight * 0.75; // Budget height 75vh
        if (available >= idealPx) return 1.0;
        return available / idealPx;
    }
    
    // Layout configurations representing rotation, scale, horizontal and vertical shifts
    const FAN_POSITIONS = [
        { rot: -21, scale: 0.7756, x: -300, y: 110, zIndex: 1 },
        { rot: -14, scale: 0.8498, x: -200, y: 60,  zIndex: 2 },
        { rot: -7,  scale: 0.9346, x: -100, y: 20,  zIndex: 3 },
        { rot: 0,   scale: 1.0,    x: 0,    y: 0,   zIndex: 10 },
        { rot: 7,   scale: 0.9346, x: 100,  y: 20,  zIndex: 3 },
        { rot: 14,  scale: 0.8498, x: 200,  y: 60,  zIndex: 2 },
        { rot: 21,  scale: 0.7756, x: 300,  y: 110, zIndex: 1 },
    ];
    
    function getSlotConfig(slotCount, slot) {
        if (slotCount >= MAX_VISIBLE) return FAN_POSITIONS[slot];
        const center = slotCount >> 1;
        const distance = slotCount > 1 ? (slot - center) / center : 0;
        const absDistance = Math.abs(distance);
        return {
            rot: distance * 21,
            scale: 1.0 - 0.2244 * absDistance * absDistance,
            x: distance * 300,
            y: absDistance * absDistance * 110,
            zIndex: 10 - Math.abs(slot - center)
        };
    }

    function getSlotOpacity(slot, width) {
        const isMobile = width < 768;
        if (isMobile) {
            if (slot === 0 || slot === 6) return 0.0; // Hide outermost slots on mobile to prevent clutter
            if (slot === 1 || slot === 5) return 0.35;
            if (slot === 2 || slot === 4) return 0.8;
            return 1.0; // Center slot
        } else {
            if (slot === 0 || slot === 6) return 0.45;
            if (slot === 1 || slot === 5) return 0.75;
            if (slot === 2 || slot === 4) return 0.9;
            return 1.0; // Center slot
        }
    }
    
    function getVisibleMap(center) {
        const map = new Map();
        if (!needsPagination) {
            cards.forEach((_, i) => map.set(i, i));
            return map;
        }
        for (let slot = 0; slot < MAX_VISIBLE; slot++) {
            const index = ((center + slot - HALF) % totalCards + totalCards) % totalCards;
            map.set(index, slot);
        }
        return map;
    }
    
    // Core layout animator using GSAP
    function updateLayout(isFirstMount = false) {
        isAnimating = true;
        const visibleMap = getVisibleMap(centerIndex);
        const multiplier = getResponsiveMultiplier();
        const hMult = getHeightMultiplier();
        const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
        
        let completedCount = 0;
        const visibleCount = visibleMap.size;
        
        const onCardDone = () => {
            completedCount++;
            if (completedCount >= visibleCount) {
                isAnimating = false;
                setupHoverListeners(); // Rebind hover coordinates
            }
        };
        
        // Update Dots Active class
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === centerIndex);
        });
        
        cards.forEach((card, cardIndex) => {
            const slot = visibleMap.get(cardIndex);
            const wasVisible = previouslyVisible.has(cardIndex);
            
            if (slot !== undefined) {
                const config = getSlotConfig(slotCount, slot);
                const targetX = config.x * multiplier;
                const targetY = config.y * hMult;
                
                card.style.pointerEvents = 'auto'; // Re-enable clicks
                
                const target = {
                    x: targetX,
                    y: targetY,
                    rotation: config.rot,
                    scale: config.scale,
                    opacity: getSlotOpacity(slot, window.innerWidth),
                    zIndex: config.zIndex,
                    duration: isFirstMount ? 1.2 : 0.5,
                    ease: isFirstMount ? "elastic.out(1.05,.78)" : "power2.out",
                    onComplete: onCardDone,
                    delay: isFirstMount ? 0.2 + slot * 0.06 : 0
                };
                
                if (isFirstMount) {
                    gsap.set(card, { x: 0, y: 180 * hMult, rotation: 0, scale: 0.5, opacity: 0 });
                    gsap.to(card, target);
                } else if (!wasVisible) {
                    const enterX = direction === 'right' ? 600 * multiplier : -600 * multiplier;
                    gsap.set(card, { x: enterX, y: targetY, rotation: direction === 'right' ? 30 : -30, scale: 0.5, opacity: 0 });
                    gsap.to(card, target);
                } else {
                    gsap.to(card, target);
                }
            } else {
                card.style.pointerEvents = 'none'; // Disable clicks for hidden cards
                if (wasVisible) {
                    const exitX = direction === 'right' ? -600 * multiplier : 600 * multiplier;
                    gsap.to(card, {
                        x: exitX,
                        opacity: 0,
                        scale: 0.5,
                        rotation: direction === 'right' ? -30 : 30,
                        duration: 0.4,
                        ease: "power2.in",
                        zIndex: 0
                    });
                } else if (isFirstMount) {
                    gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
                }
            }
        });
        
        previouslyVisible = new Set(visibleMap.keys());
    }
    
    function cycle(dir) {
        if (isAnimating || !needsPagination) return;
        direction = dir;
        if (dir === 'right') {
            centerIndex = (centerIndex + 1) % totalCards;
        } else {
            centerIndex = (centerIndex - 1 + totalCards) % totalCards;
        }
        updateLayout();
    }
    
    function goToIndex(idx) {
        if (isAnimating) return;
        direction = idx > centerIndex ? 'right' : 'left';
        centerIndex = idx;
        updateLayout();
    }
    
    leftArrow.addEventListener('click', () => cycle('left'));
    rightArrow.addEventListener('click', () => cycle('right'));
    
    // Initial mount trigger
    updateLayout(true);
    
    // Interactive mouseover spreading handler
    let hoverHandlers = [];
    
    function setupHoverListeners() {
        // Unbind previous elements
        hoverHandlers.forEach(h => {
            h.el.removeEventListener('mouseenter', h.handler);
        });
        hoverHandlers = [];
        
        const visibleMap = getVisibleMap(centerIndex);
        const visibleEntries = [];
        cards.forEach((el, i) => {
            const slot = visibleMap.get(i);
            if (slot !== undefined) visibleEntries.push({ el, slot });
        });
        visibleEntries.sort((a, b) => a.slot - b.slot);
        
        const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
        const centerSlot = visibleEntries.length >> 1;
        
        const updateHoverLayout = (hoveredSlot) => {
            const mult = getResponsiveMultiplier();
            const hM = getHeightMultiplier();
            
            visibleEntries.forEach(({ el, slot }) => {
                const base = getSlotConfig(slotCount, slot);
                let targetX = base.x * mult;
                let targetY = base.y * hM;
                let targetRot = base.rot;
                let targetScale = base.scale;
                let delay = 0;
                
                if (hoveredSlot !== null) {
                    const distance = Math.abs(slot - hoveredSlot);
                    delay = distance * 0.02;
                    
                    if (slot === hoveredSlot) {
                        targetY -= 40 * hM; // Translate hovered card upwards
                        targetScale *= 1.08;
                    } else {
                        const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
                        const pushStrength = 110 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));
                        
                        if (slot < hoveredSlot) {
                            targetX -= pushStrength * mult;
                            targetRot -= 4 / (distance + 1);
                        } else {
                            targetX += pushStrength * mult;
                            targetRot += 4 / (distance + 1);
                        }
                    }
                } else {
                    delay = Math.abs(slot - centerSlot) * 0.02;
                }
                
                gsap.to(el, {
                    x: targetX,
                    y: targetY,
                    rotation: targetRot,
                    scale: targetScale,
                    opacity: getSlotOpacity(slot, window.innerWidth),
                    duration: 0.5,
                    delay: delay,
                    ease: "elastic.out(1,.75)",
                    overwrite: "auto"
                });
                gsap.set(el, { zIndex: base.zIndex });
            });
        };
        
        visibleEntries.forEach(({ el, slot }) => {
            const handler = () => {
                if (isAnimating) return;
                updateHoverLayout(slot);
            };
            el.addEventListener('mouseenter', handler);
            hoverHandlers.push({ el, handler });
        });
        
        const onMouseLeave = () => {
            if (isAnimating) return;
            updateHoverLayout(null);
        };
        track.addEventListener('mouseleave', onMouseLeave);
        hoverHandlers.push({ el: track, handler: onMouseLeave });
    }
    
    // Window Resize debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isAnimating) updateLayout();
        }, 150);
    });
});
