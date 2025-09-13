document.querySelectorAll('a[href^="#"]:not(#mobile-menu-button):not(#mobile-menu-button *)').forEach(anchor => {
    const isInsideHamburger = anchor.closest('#mobile-menu-button');
    if (isInsideHamburger) {
        console.log('Saltando enlace dentro del botón hamburguesa:', anchor);
        return;
    }
    
    anchor.addEventListener('click', function (e) {
        console.log('Smooth scroll activado para:', this.getAttribute('href'));
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.carousel-card, .proposal-card, .voting-step').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

class CandidateCarousel {
    constructor() {
        this.track = document.getElementById('candidateCarousel');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.indicators = document.querySelectorAll('.carousel-indicator');
        this.cards = document.querySelectorAll('.carousel-card');
        
        this.currentSlide = 0;
        this.cardWidth = 320;
        this.visibleCards = this.getVisibleCards();
        this.totalSlides = Math.max(0, this.cards.length - this.visibleCards + 1);
        
        this.init();
        this.setupEventListeners();
        this.setupResizeListener();
    }
    
    getVisibleCards() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) return 3;
        if (screenWidth >= 768) return 2;
        return 1;
    }
    
    init() {
        this.updateCarousel();
        this.updateIndicators();
        this.updateButtons();
    }
    
    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        let startX = 0;
        let isDragging = false;
        
        this.track?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.track?.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.track?.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.visibleCards = this.getVisibleCards();
            this.totalSlides = Math.max(0, this.cards.length - this.visibleCards + 1);
            this.currentSlide = Math.min(this.currentSlide, this.totalSlides - 1);
            this.updateCarousel();
            this.updateButtons();
        });
    }
    
    updateCarousel() {
        if (this.track) {
            const translateX = -this.currentSlide * this.cardWidth;
            this.track.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.remove('bg-blue-200');
                indicator.classList.add('bg-blue-600');
            } else {
                indicator.classList.remove('bg-blue-600');
                indicator.classList.add('bg-blue-200');
            }
        });
    }
    
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentSlide >= this.totalSlides - 1 ? '0.5' : '1';
            this.nextBtn.disabled = this.currentSlide >= this.totalSlides - 1;
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
            this.updateIndicators();
            this.updateButtons();
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateCarousel();
            this.updateIndicators();
            this.updateButtons();
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateCarousel();
            this.updateIndicators();
            this.updateButtons();
        }
    }
}

// ===== FUNCIONALIDAD DEL MENÚ MÓVIL HAMBURGUESA =====
class MobileMenu {
    constructor() {
        console.log('Inicializando MobileMenu...');
        this.menuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.isOpen = false;
        
        console.log('menuButton:', this.menuButton);
        console.log('mobileMenu:', this.mobileMenu);
        console.log('mobileNavLinks:', this.mobileNavLinks);
        
        this.init();
    }
    
    init() {
        if (!this.menuButton || !this.mobileMenu) {
            console.error('No se encontraron los elementos del menú móvil');
            return;
        }
        
        console.log('Agregando event listener al botón hamburguesa');
        this.menuButton.addEventListener('click', (e) => {
            console.log('Click en botón hamburguesa detectado');
            e.preventDefault();
            this.toggleMenu();
        });
        
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menuButton.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        console.log('toggleMenu llamado, isOpen:', this.isOpen);
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        console.log('openMenu llamado');
        this.isOpen = true;
        this.menuButton.classList.add('active');
        this.mobileMenu.classList.add('active');
        console.log('Clases agregadas - menuButton:', this.menuButton.classList);
        console.log('Clases agregadas - mobileMenu:', this.mobileMenu.classList);
        
        document.body.style.overflow = 'hidden';
        
        this.mobileNavLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
                link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, index * 100);
        });
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menuButton.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        
        document.body.style.overflow = '';
        
        this.mobileNavLinks.forEach(link => {
            link.style.opacity = '';
            link.style.transform = '';
            link.style.transition = '';
        });
    }
}

console.log('Inicializando aplicación...');
new CandidateCarousel();

console.log('Buscando elementos del menú...');
const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

console.log('menuButton encontrado:', menuButton);
console.log('mobileMenu encontrado:', mobileMenu);

if (menuButton && mobileMenu) {
    console.log('Agregando event listener simple...');
    
    menuButton.addEventListener('click', function(e) {
        console.log('¡Click detectado en botón hamburguesa!');
        console.log('Event target:', e.target);
        console.log('Current target:', e.currentTarget);
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (mobileMenu.classList.contains('active')) {
            console.log('Cerrando menú...');
            mobileMenu.classList.remove('active');
            menuButton.classList.remove('active');
        } else {
            console.log('Abriendo menú...');
            mobileMenu.classList.add('active');
            menuButton.classList.add('active');
        }
        
        return false;
    }, true);
    
} else {
    console.error('No se pudieron encontrar los elementos del menú móvil');
}