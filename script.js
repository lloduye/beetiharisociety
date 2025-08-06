// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .education-item, .impact-card, .help-card, .leader-card, .mission-card');
    animateElements.forEach(el => observer.observe(el));
});

// Counter animation for impact numbers
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Animate counters when impact section is visible
const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.impact-number');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent.replace(',', ''));
                animateCounter(counter, target);
            });
            impactObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const impactSection = document.querySelector('.impact');
if (impactSection) {
    impactObserver.observe(impactSection);
}

// Email validation for contact forms
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.href && this.href.startsWith('mailto:')) {
            // For email links, add a small delay to show loading state
            this.style.pointerEvents = 'none';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.style.pointerEvents = 'auto';
                this.style.opacity = '1';
            }, 1000);
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects to cards
document.querySelectorAll('.service-card, .education-item, .impact-card, .help-card, .leader-card, .mission-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click-to-copy functionality for email addresses
document.querySelectorAll('a[href^="mailto:"]').forEach(emailLink => {
    emailLink.addEventListener('click', function(e) {
        const email = this.href.replace('mailto:', '');
        
        // Create a temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Email copied to clipboard!';
        tooltip.style.cssText = `
            position: fixed;
            top: ${e.clientY - 40}px;
            left: ${e.clientX}px;
            background: #667eea;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // Show tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 300);
        }, 2000);
        
        // Copy email to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email);
        }
    });
});

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on escape
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add focus management for accessibility
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('focus', function() {
        this.style.outline = '2px solid #667eea';
        this.style.outlineOffset = '2px';
    });
    
    link.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Add loading animation for page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add error handling for images (fallback for image placeholders)
document.querySelectorAll('.image-placeholder').forEach(placeholder => {
    placeholder.addEventListener('error', function() {
        this.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Image not available</p>
        `;
    });
});

// Add responsive image handling
function handleResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
}

// Initialize responsive images
handleResponsiveImages();

// Add smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(section);
});

// Add donation amount suggestions
function createDonationSuggestions() {
    const donateSection = document.querySelector('.donate');
    if (donateSection) {
        const suggestions = document.createElement('div');
        suggestions.className = 'donation-suggestions';
        suggestions.innerHTML = `
            <h4>Suggested Donation Amounts</h4>
            <div class="suggestion-buttons">
                <button class="suggestion-btn" data-amount="25">$25</button>
                <button class="suggestion-btn" data-amount="50">$50</button>
                <button class="suggestion-btn" data-amount="100">$100</button>
                <button class="suggestion-btn" data-amount="250">$250</button>
            </div>
        `;
        
        suggestions.style.cssText = `
            margin-top: 2rem;
            text-align: center;
        `;
        
        const suggestionButtons = suggestions.querySelectorAll('.suggestion-btn');
        suggestionButtons.forEach(btn => {
            btn.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px 16px;
                margin: 0 8px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            btn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255, 255, 255, 0.3)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            btn.addEventListener('click', function() {
                const amount = this.dataset.amount;
                // Here you would typically update a donation form
                console.log(`Selected donation amount: $${amount}`);
            });
        });
        
        const donateText = donateSection.querySelector('.donate-text');
        if (donateText) {
            donateText.appendChild(suggestions);
        }
    }
}

// Initialize donation suggestions
createDonationSuggestions();

// Add social sharing functionality
function addSocialSharing() {
    const shareButtons = document.createElement('div');
    shareButtons.className = 'social-share';
    shareButtons.innerHTML = `
        <h4>Share Our Mission</h4>
        <div class="share-buttons">
            <button class="share-btn" data-platform="facebook">
                <i class="fab fa-facebook"></i> Facebook
            </button>
            <button class="share-btn" data-platform="twitter">
                <i class="fab fa-twitter"></i> Twitter
            </button>
            <button class="share-btn" data-platform="linkedin">
                <i class="fab fa-linkedin"></i> LinkedIn
            </button>
        </div>
    `;
    
    shareButtons.style.cssText = `
        margin-top: 2rem;
        text-align: center;
    `;
    
    const shareBtnElements = shareButtons.querySelectorAll('.share-btn');
    shareBtnElements.forEach(btn => {
        btn.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 16px;
            margin: 0 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        btn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Support education in South Sudan with Beeti Hari Society');
            
            let shareUrl = '';
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerContent = footer.querySelector('.footer-content');
        if (footerContent) {
            footerContent.appendChild(shareButtons);
        }
    }
}

// Initialize social sharing
addSocialSharing();

// Add newsletter signup placeholder
function addNewsletterSignup() {
    const newsletter = document.createElement('div');
    newsletter.className = 'newsletter-signup';
    newsletter.innerHTML = `
        <h4>Stay Updated</h4>
        <p>Subscribe to our newsletter for updates on our work in South Sudan</p>
        <div class="newsletter-form">
            <input type="email" placeholder="Enter your email address" class="newsletter-input">
            <button class="newsletter-btn">Subscribe</button>
        </div>
    `;
    
    newsletter.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        margin-top: 2rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    const input = newsletter.querySelector('.newsletter-input');
    const button = newsletter.querySelector('.newsletter-btn');
    
    input.style.cssText = `
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        margin-right: 10px;
        width: 250px;
    `;
    
    button.style.cssText = `
        padding: 12px 24px;
        background: white;
        color: #667eea;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
    `;
    
    button.addEventListener('click', function() {
        const email = input.value;
        if (validateEmail(email)) {
            alert('Thank you for subscribing! We\'ll keep you updated on our work.');
            input.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
    
    const donateSection = document.querySelector('.donate');
    if (donateSection) {
        const donateText = donateSection.querySelector('.donate-text');
        if (donateText) {
            donateText.appendChild(newsletter);
        }
    }
}

// Initialize newsletter signup
addNewsletterSignup();

console.log('Beeti Hari Society website loaded successfully!'); 