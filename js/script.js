// Smooth scrolling for navigation links with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add animation on scroll
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

// Observe all candidate cards and proposal cards
document.querySelectorAll('.carousel-card, .proposal-card, .voting-step').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Carrusel de candidatos
class CandidateCarousel {
    constructor() {
        this.track = document.getElementById('candidateCarousel');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.indicators = document.querySelectorAll('.carousel-indicator');
        this.cards = document.querySelectorAll('.carousel-card');
        
        this.currentSlide = 0;
        this.cardWidth = 320; // w-80 + mx-4 (320px + 32px margin)
        this.visibleCards = this.getVisibleCards();
        this.totalSlides = Math.max(0, this.cards.length - this.visibleCards + 1);
        
        this.init();
        this.setupEventListeners();
        this.setupResizeListener();
    }
    
    getVisibleCards() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) return 3; // lg: 3 cards
        if (screenWidth >= 768) return 2;  // md: 2 cards
        return 1; // sm: 1 card
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
        
        // Touch/swipe support
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
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
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

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CandidateCarousel();
});
