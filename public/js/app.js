document.addEventListener('DOMContentLoaded', () => {
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from('.reveal', {
            y: 24,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
                trigger: '.reveal',
                start: 'top 86%'
            }
        });
    }
});
