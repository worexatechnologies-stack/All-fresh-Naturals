import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import heroBg from '../assets/hero_bg.png';

export default function SmoothScroll() {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Native touch scrolling is more reliable for taps, drawers and form controls.
    // Lenis is therefore a desktop-only enhancement.
    if (window.matchMedia('(max-width: 768px), (pointer: coarse)').matches) {
      return;
    }

    // 1. Initialize Lenis with ultra-silky liquid momentum physics on desktop.
    const lenis = new Lenis({
      lerp: 0.06,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1,
      syncTouch: false,
      infinite: false,
      prevent: (node) => {
        if (!node) return false;
        const el = node as HTMLElement;
        return Boolean(
          el.closest?.(
            '[data-lenis-prevent], .afn-mobile-drawer, .afn-mobile-backdrop, .afn-navbar, .afn-header-root, .admin-modern-modal-overlay, .admin-modern-modal-card, .admin-modal-body-scroll, .auth-modal-box, .auth-modal-overlay, .cart-drawer, .cart-drawer-items, .admin-table-container, [role="dialog"]'
          )
        );
      }
    });
    lenisRef.current = lenis;

    let currentScale = 1.0;
    let targetScale = 1.0;

    // 2. High-performance scroll listener (Fluid velocity & zoom calculations)
    const handleScroll = (e: { scroll: number; velocity: number; direction: number }) => {
      const scrollY = e.scroll;
      const velocity = Math.abs(e.velocity);
      const direction = e.direction; // 1 = down, -1 = up

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Silky dynamic background zoom-in on scroll down, zoom-out on scroll up
      const velocityImpulse = Math.min(velocity * 0.006, 0.05);

      if (direction > 0) {
        // Scrolling Down: Smoothly zoom in
        targetScale = 1.0 + progress * 0.12 + velocityImpulse;
      } else if (direction < 0) {
        // Scrolling Up: Smoothly zoom out
        targetScale = Math.max(0.99, 1.0 + progress * 0.12 - velocityImpulse);
      } else {
        targetScale = 1.0 + progress * 0.09;
      }

      // Set CSS custom properties on root
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(2));
      document.documentElement.style.setProperty('--scroll-dir', direction.toString());
    };

    lenis.on('scroll', handleScroll);

    // 3. 60/120fps RAF loop with smooth lerp
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);

      // Silky smooth lerp for background breathing zoom
      currentScale += (targetScale - currentScale) * 0.05;
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(${currentScale.toFixed(4)}) translate3d(0, 0, 0)`;
      }

      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // 4. Lightweight IntersectionObserver for Card Zoom-In/Zoom-Out on Scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view-zoom');
            entry.target.classList.remove('out-view-zoom');
          } else {
            entry.target.classList.remove('in-view-zoom');
            entry.target.classList.add('out-view-zoom');
          }
        });
      },
      {
        threshold: [0.15, 0.5, 0.85],
        rootMargin: '0px 0px -20px 0px'
      }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll(
        '.nh-prod-card, .wl-prod-card, .nh-service-card, .nh-nutr-card, .nh-story-card, .nh-pillar-card, .nh-review-card, .nh-faq-item, .about-standards-glass-card, .about-glass-card, .nh-trust-bar'
      );
      targets.forEach((t) => observer.observe(t));
    };

    observeElements();
    const timer = setTimeout(observeElements, 500);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  // Smooth scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  return (
    <div
      ref={bgRef}
      className="global-ambient-zoom-bg"
      aria-hidden="true"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    />
  );
}
