document.addEventListener('DOMContentLoaded', () => {
    const pickerScroller = document.querySelector('.picker-scroller');
    const itemHeight = 40; // 每个选项的高度
    const items = []; // 存储所有选项的数据

    // 动态生成选项
    for (let i = 1; i <= 20; i++) {
        items.push(`选项 ${i}`);
    }

    // 将选项添加到 DOM
    items.forEach((text, index) => {
        const item = document.createElement('div');
        item.className = 'picker-item';
        item.textContent = text;
        const angle = -index * 20; // 每个选项旋转 20 度
        item.style.transform = `rotateX(${angle}deg) translateZ(100px)`;
        pickerScroller.appendChild(item);
    });

    let startY = 0;
    let currentAngle = 0;
    let lastAngle = 0;
    let startTime = 0;

    pickerScroller.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startY = e.touches[0].clientY;
        startTime = Date.now();
        pickerScroller.style.transition = '';
    });

    pickerScroller.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const deltaY = e.touches[0].clientY - startY;
        const moveAngle = Math.round(deltaY / itemHeight) * 20; // 根据移动距离计算旋转角度
        currentAngle = lastAngle + moveAngle;
        pickerScroller.style.transform = `rotateX(${currentAngle}deg)`;
    });

    pickerScroller.addEventListener('touchend', (e) => {
        const endTime = Date.now();
        const deltaTime = endTime - startTime;
        const deltaY = e.changedTouches[0].clientY - startY;
        const velocity = deltaY / deltaTime; // 计算滑动速度

        // 根据速度模拟惯性滚动
        const inertiaAngle = velocity * 120;
        currentAngle += inertiaAngle;

        // 确保最终角度是 20 的倍数，以便对齐
        currentAngle = Math.round(currentAngle / 20) * 20;

        // 限制最大和最小滚动角度
        const maxAngle = 0;
        const minAngle = -(items.length - 1) * 20;
        if (currentAngle > maxAngle) {
            currentAngle = maxAngle;
        }
        if (currentAngle < minAngle) {
            currentAngle = minAngle;
        }

        pickerScroller.style.transition = 'transform 0.3s ease-out';
        pickerScroller.style.transform = `rotateX(${currentAngle}deg)`;
        lastAngle = currentAngle;

        // 计算并打印选中的值
        const selectedIndex = Math.abs(Math.round(currentAngle / 20));
        console.log(`选中: ${items[selectedIndex]}`);
    });
});