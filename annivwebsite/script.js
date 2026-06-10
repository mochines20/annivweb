// ===== LOADING SCREEN =====
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const spotlightWrapper = loadingScreen.querySelector('.spotlight-wrapper');
    const loadingText = loadingScreen.querySelector('.loading-text');
    const mainContent = document.getElementById('main-content');
    const nav = document.getElementById('nav');
    
    // Manual blink animation with JS setTimeout chains
    // Each blink: 1.2s on, 0.4s off
    
    function runBlinkSequence() {
        // Blink 1: 0-1.2s
        setTimeout(() => { spotlightWrapper.style.opacity = '1'; }, 0);
        setTimeout(() => { spotlightWrapper.style.opacity = '0'; }, 1200);
        
        // Blink 2: 1.6-2.8s (0.4s gap after blink 1)
        setTimeout(() => { spotlightWrapper.style.opacity = '1'; }, 1600);
        setTimeout(() => { spotlightWrapper.style.opacity = '0'; }, 2800);
        
        // Blink 3: 3.2-4.4s (0.4s gap after blink 2)
        setTimeout(() => { spotlightWrapper.style.opacity = '1'; }, 3200);
        setTimeout(() => { spotlightWrapper.style.opacity = '1'; loadingText.style.opacity = '1'; }, 4400);
        
        // Hold for 1.5 seconds with text visible, then transition
        setTimeout(() => {
            // Fade out cone and text together (1s transition)
            spotlightWrapper.style.transition = 'opacity 1s ease-out';
            loadingText.style.transition = 'opacity 1s ease-out';
            spotlightWrapper.style.opacity = '0';
            loadingText.style.opacity = '0';
            
            // After 1s fade, slide up loading screen (0.8s ease-in-out)
            setTimeout(() => {
                loadingScreen.style.transition = 'transform 0.8s ease-in-out';
                loadingScreen.style.transform = 'translateY(-100%)';
                
                // After 0.8s slide, fade in main content (0.6s ease)
                setTimeout(() => {
                    mainContent.style.transition = 'opacity 0.6s ease';
                    mainContent.style.opacity = '1';
                    nav.style.transition = 'opacity 0.6s ease';
                    nav.style.opacity = '1';
                    loadingScreen.style.display = 'none';
                    
                    // Trigger first chapter animations with 300ms delay
                    setTimeout(() => {
                        const firstChapter = document.querySelector('#chapter-1 .spotlight-container');
                        if (firstChapter) {
                            firstChapter.classList.add('animate-in');
                        }
                    }, 300);
                }, 800);
            }, 1000);
        }, 5900); // 4.4s + 1.5s hold = 5.9s
    }
    
    // Start the sequence
    runBlinkSequence();
});

// ===== SCROLL ANIMATIONS FOR CHAPTERS =====
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    };
    
    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target.querySelector('.spotlight-container');
                if (container && !container.classList.contains('animate-in')) {
                    container.classList.add('animate-in');
                }
            }
        });
    }, observerOptions);
    
    // Observe all chapter sections
    const chapters = document.querySelectorAll('.chapter');
    chapters.forEach(chapter => {
        chapterObserver.observe(chapter);
    });
    
    // Also observe closing section
    const closing = document.querySelector('.closing');
    if (closing) {
        const closingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target.querySelector('.spotlight-container');
                    const closingTitle = entry.target.querySelector('.closing-title');
                    
                    if (container && !container.classList.contains('animate-in')) {
                        container.classList.add('animate-in');
                    }
                    
                    // Trigger letter-by-letter animation
                    if (closingTitle && !closingTitle.classList.contains('animate-in')) {
                        closingTitle.classList.add('animate-in');
                    }
                }
            });
        }, { root: null, rootMargin: '-30% 0px -30% 0px', threshold: 0.1 });
        
        closingObserver.observe(closing);
    }
});

// ===== 6-SECOND FALLBACK TO FORCE CONTENT VISIBLE =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('fallback-active');
    }, 6000);
});

// ===== LETTER-BY-LETTER ANIMATION SETUP =====
document.addEventListener('DOMContentLoaded', () => {
    const closingTitle = document.querySelector('.closing-title');
    if (closingTitle) {
        const text = closingTitle.textContent;
        closingTitle.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${index * 0.05}s`;
            closingTitle.appendChild(span);
        });
    }
});

// ===== NAVIGATION DOT ACTIVE STATE =====
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.chapter, .closing');
    const navDots = document.querySelectorAll('.nav-dot');
    
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Update active nav dot
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${sectionId}`) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// ===== SMOOTH SCROLL FOR NAV DOTS =====
document.addEventListener('DOMContentLoaded', () => {
    const navDots = document.querySelectorAll('.nav-dot');
    
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        const sections = Array.from(document.querySelectorAll('.chapter, .closing'));
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;
        
        let currentSectionIndex = -1;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (currentScroll >= sectionTop - windowHeight / 2 && 
                currentScroll < sectionBottom - windowHeight / 2) {
                currentSectionIndex = index;
            }
        });
        
        if (e.key === 'ArrowDown' && currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
            sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

