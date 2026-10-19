// Paul Osteen Portfolio - Modular Script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize non-dynamic elements
    initCursor();
    initScrollReveal();
    
    // Load dynamic content
    loadProjects();
    loadProjectDetail();
    
    initContactForm();

    console.log("%cPaul Osteen | Software Developer", "color: #e0e0e0; font-weight: bold; background: #121212; padding: 5px 10px; border-radius: 2px;");
});

// 1. Scroll Reveal Helper (Must be defined before usage)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal, .reveal-text');
    reveals.forEach(el => revealObserver.observe(el));
};

// 2. Custom Cursor Logic
const initCursor = () => {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const animateCursor = () => {
        const easing = 0.12;
        outlineX += (mouseX - outlineX - 16) * easing;
        outlineY += (mouseY - outlineY - 16) * easing;
        outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const updateHoverTargets = () => {
        const hoverTargets = document.querySelectorAll('a, button, .project-entry, input, textarea, .project-entry-link');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                outline.style.transform += ' scale(2.5)';
                outline.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            });
            el.addEventListener('mouseleave', () => {
                outline.style.transform = outline.style.transform.replace(' scale(2.5)', '');
                outline.style.backgroundColor = 'transparent';
            });
        });
    };
    updateHoverTargets();
    window.updateCursorHovers = updateHoverTargets; // Export for dynamic content
};

// 3. Dynamic Project Rendering
const loadProjects = () => {
    const container = document.getElementById('project-container');
    if (!container) return;

    const projects = window.portfolioProjects || [];
    const isHomePage = !window.location.pathname.includes('projects.html') && !window.location.pathname.includes('project-detail.html');
    const projectsToShow = isHomePage ? projects.slice(0, 2) : projects;

    if (projectsToShow.length === 0) {
        console.warn("No projects found in window.portfolioProjects");
        return;
    }

    container.innerHTML = projectsToShow.map(p => `
        <a href="project-detail.html?id=${p.id}" class="project-entry-link">
            <article class="project-entry reveal">
                <div class="project-visual">
                    <img src="${p.heroImage}" alt="${p.title}" class="project-img">
                </div>
                <div class="project-info">
                    <span class="project-num">${p.id}</span>
                    <h3 class="project-title">${p.title}</h3>
                    <p class="project-desc">${p.description}</p>
                </div>
            </article>
        </a>
    `).join('');

    // CRITICAL: Observe newly injected elements
    const newReveals = container.querySelectorAll('.reveal');
    newReveals.forEach(el => revealObserver.observe(el));
    if (window.updateCursorHovers) window.updateCursorHovers();
};

// 4. Project Detail Page Logic
const loadProjectDetail = () => {
    const main = document.getElementById('detail-main');
    if (!main || !window.location.pathname.includes('project-detail.html')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const project = (window.portfolioProjects || []).find(p => p.id === projectId);

    if (project) {
        document.title = `${project.title} | Paul Osteen`;
        main.innerHTML = `
            <article class="case-study reveal">
                <header class="cs-header section">
                    <div class="cs-intro">
                        <span class="cs-num">${project.id}</span>
                        <h1 class="cs-title">${project.title}</h1>
                        <p class="cs-overview large-text">${project.overview}</p>
                    </div>
                </header>

                <div class="cs-hero section">
                    <div class="project-visual cs-hero-visual">
                        <img src="${project.heroImage}" alt="${project.title}" class="project-img cs-primary-img">
                    </div>
                </div>

                <div class="cs-content section">
                    <div class="cs-grid">
                        <div class="cs-details">
                            <div class="cs-detail-block">
                                <h4 class="section-label">Perspective</h4>
                                <p>${project.role}</p>
                            </div>
                            <div class="cs-detail-block">
                                <h4 class="section-label">Challenge</h4>
                                <p>${project.challenge}</p>
                            </div>
                            <div class="cs-detail-block">
                                <h4 class="section-label">Outcome</h4>
                                <p class="impact">${project.impact}</p>
                            </div>
                        </div>
                        <div class="cs-sidebar">
                            <div class="cs-detail-block">
                                <h4 class="section-label">Technology Stack</h4>
                                <ul class="tech-list">
                                    ${project.tech.map(t => `<li class="tech-tag">${t}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cs-gallery section">
                    <h2 class="section-label cs-gallery-title">System Visuals</h2>
                    <div class="gallery-grid">
                        ${project.secondaryImages.map(img => `
                            <div class="project-visual">
                                <img src="${img}" alt="System Detail" class="project-img cs-primary-img">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="cs-footer section">
                    <a href="projects.html" class="btn-secondary">Back to Archive</a>
                    <a href="index.html#contact" class="btn-secondary" style="margin-left: 20px;">Discuss Case Study</a>
                </div>
            </article>
        `;
        
        // Re-initialize reveal for dynamic content
        const newReveals = main.querySelectorAll('.reveal');
        newReveals.forEach(el => revealObserver.observe(el));
        if (window.updateCursorHovers) window.updateCursorHovers();
    } else {
        main.innerHTML = `<div class="section"><p>Project not found. <a href="projects.html">Return to Archive</a></p></div>`;
    }
};

// 5. Contact Form Interaction
const initContactForm = () => {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Inquiry Received';
            contactForm.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
};
