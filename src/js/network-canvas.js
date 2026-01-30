export function initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Theme-aware colors
    let nodeColor = '#eab308';
    let connectionColor = '234, 179, 8';

    function updateThemeColors() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (theme === 'light') {
            nodeColor = '#c27803'; // Darker gold for contrast on white
            connectionColor = '194, 120, 3'; 
        } else {
            nodeColor = '#eab308'; // Brand Yellow
            connectionColor = '234, 179, 8';
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 1.5; // Slightly larger for visibility
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.fill();
            
            // Add stroke for visibility in light mode
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            if (theme === 'light') {
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(width / 15, 80);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        updateThemeColors();

        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        ctx.lineWidth = theme === 'light' ? 0.8 : 0.5; // Slightly thicker lines in light mode

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    // Keep the fading effect but ensure it starts from a more visible point in light mode
                    const opacity = (1 - distance / 150) * (theme === 'light' ? 0.4 : 0.7);
                    ctx.strokeStyle = `rgba(${connectionColor}, ${opacity})`;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}
