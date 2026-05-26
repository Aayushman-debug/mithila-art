import { useEffect, useRef } from 'react';

const COLORS = ['#C62828', '#E65100', '#2E7D32', '#1565C0', '#F9A825', '#D81B60', '#8B6914'];

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity = Math.random() * 0.4 + 0.1;
    this.shape = Math.floor(Math.random() * 3); // 0=circle, 1=diamond, 2=dot
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    switch (this.shape) {
      case 0: // circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 1: // diamond
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.5);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.5);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();
        break;
      case 2: // small dot
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }
}

export default function ParticleCanvas({ className = '', particleCount = 50 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 105, 20, ${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
