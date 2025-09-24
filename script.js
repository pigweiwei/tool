document.addEventListener('DOMContentLoaded', () => {
    const scroller = document.querySelector('.picker-scroller');
    
    // --- Configurable Parameters ---
    const ITEM_HEIGHT = 36;
    const ITEMS_PER_WHEEL = 20; // Determines the angle of each item
    const FRICTION = 0.95; // Determines how fast the momentum slows down
    const BOUNCE_DAMPING = 0.5; // How much to bounce back from the edge

    let data = [];
    for (let i = 1; i <= 30; i++) {
        data.push(`选项 ${i}`);
    }

    // --- Internal State ---
    let items = [];
    let currentRotateX = 0;
    let isTouching = false;
    let startY = 0;
    let lastY = 0;
    let lastTime = 0;
    let momentum = 0;
    let animationFrame;

    // --- Calculations ---
    const ANGLE_PER_ITEM = 360 / ITEMS_PER_WHEEL;
    const RADIUS = (ITEM_HEIGHT / 2) / Math.tan((ANGLE_PER_ITEM / 2) * (Math.PI / 180));
    const MAX_ROTATE_X = 0;
    const MIN_ROTATE_X = -(data.length - 1) * ANGLE_PER_ITEM;

    // --- Functions ---
    function initialize() {
        scroller.innerHTML = '';
        data.forEach((text, index) => {
            const item = document.createElement('div');
            item.className = 'picker-item';
            item.textContent = text;
            const angle = index * ANGLE_PER_ITEM;
            item.style.transform = `rotateX(${-angle}deg) translateZ(${RADIUS}px)`;
            scroller.appendChild(item);
            items.push(item);
        });
        setRotation(0);
    }

    function setRotation(rotateX) {
        scroller.style.transform = `translateY(-${ITEM_HEIGHT/2}px) rotateX(${rotateX}deg)`;
        currentRotateX = rotateX;
    }

    function render() {
        if (!isTouching) {
            momentum *= FRICTION;

            if (Math.abs(momentum) < 0.1) {
                momentum = 0;
                stopScrolling();
                return;
            }
            
            let newRotateX = currentRotateX + momentum;

            // Bounce logic
            if (newRotateX > MAX_ROTATE_X || newRotateX < MIN_ROTATE_X) {
                momentum = -momentum * BOUNCE_DAMPING;
            }
            setRotation(currentRotateX + momentum);
        }
        animationFrame = requestAnimationFrame(render);
    }

    function startScrolling() {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(render);
    }

    function stopScrolling() {
        cancelAnimationFrame(animationFrame);
        
        // Snap to the nearest item
        let finalAngle = Math.round(currentRotateX / ANGLE_PER_ITEM) * ANGLE_PER_ITEM;

        // Clamp to boundaries
        finalAngle = Math.max(MIN_ROTATE_X, Math.min(MAX_ROTATE_X, finalAngle));
        
        scroller.style.transition = 'transform 0.2s ease-out';
        setRotation(finalAngle);

        const selectedIndex = Math.abs(Math.round(finalAngle / ANGLE_PER_ITEM));
        console.log(`选中: ${data[selectedIndex]} (索引: ${selectedIndex})`);
    }

    // --- Event Handlers ---
    scroller.addEventListener('touchstart', (e) => {
        isTouching = true;
        startY = lastY = e.touches[0].clientY;
        lastTime = Date.now();
        momentum = 0;
        scroller.style.transition = '';
        cancelAnimationFrame(animationFrame);
    });

    scroller.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isTouching) return;

        const currentY = e.touches[0].clientY;
        const deltaY = currentY - lastY;
        lastY = currentY;

        let newRotateX = currentRotateX + (deltaY / ITEM_HEIGHT) * ANGLE_PER_ITEM;
        
        // Add resistance when scrolling past boundaries
        if (newRotateX > MAX_ROTATE_X) {
            newRotateX = MAX_ROTATE_X + (newRotateX - MAX_ROTATE_X) * 0.3;
        } else if (newRotateX < MIN_ROTATE_X) {
            newRotateX = MIN_ROTATE_X + (newRotateX - MIN_ROTATE_X) * 0.3;
        }

        setRotation(newRotateX);
    });

    scroller.addEventListener('touchend', () => {
        isTouching = false;
        
        const now = Date.now();
        const deltaTime = now - lastTime;

        // Only calculate momentum if the touch was reasonably short
        if (deltaTime < 100) {
            const deltaY = lastY - startY;
            momentum = (deltaY / deltaTime) * 5; // Multiplier to get a good "fling"
        }
        
        // If we are outside boundaries, just snap back
        if (currentRotateX > MAX_ROTATE_X || currentRotateX < MIN_ROTATE_X) {
            stopScrolling();
        } else {
             startScrolling();
        }
    });

    // --- Start ---
    initialize();
});
