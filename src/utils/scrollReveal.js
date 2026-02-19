export function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

export function initSkillBarAnimation() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    if (width) {
                        entry.target.style.width = width;
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    document.querySelectorAll('.skill-bar[data-width], .skill-group-bar[data-width]').forEach(el => {
        observer.observe(el);
    });
}
