/* ============================================
   RK PROMOTERS - Premium JavaScript
   ============================================ */

// ============ PRELOADER ============
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('loaded');
    }, 1000);
});

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
let lastScroll = 0;
let navbarScrolled = false;
let scrollTick = false;

window.addEventListener('scroll', () => {
    if (!scrollTick) {
        requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            
            // Use hysteresis to prevent flicker: different thresholds for add vs remove
            if (!navbarScrolled && currentScroll > 50) {
                navbar.classList.add('scrolled');
                navbarScrolled = true;
            } else if (navbarScrolled && currentScroll < 20) {
                navbar.classList.remove('scrolled');
                navbarScrolled = false;
            }
            
            lastScroll = currentScroll;
            
            // Back to top button
            const backToTop = document.getElementById('backToTop');
            if (backToTop) {
                if (currentScroll > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }
            
            // Active nav link based on scroll
            updateActiveNavLink();
            scrollTick = false;
        });
        scrollTick = true;
    }
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============ MOBILE MENU ============
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    
    navLinks.classList.toggle('mobile-active');
    hamburger.classList.toggle('active');
    
    // Close menu on link click
    if (navLinks.classList.contains('mobile-active')) {
        document.body.style.overflow = 'hidden';
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    } else {
        document.body.style.overflow = '';
    }
}

// ============ HERO SLIDER ============
let currentSlide = 0;
const totalSlides = 3;
let slideInterval;

function goToSlide(index) {
    const bgSlides = document.querySelectorAll('.hero-slide');
    const textSlides = document.querySelectorAll('.hero-text-slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!bgSlides.length) return;
    
    bgSlides.forEach(slide => slide.classList.remove('active'));
    textSlides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = index;
    
    bgSlides[currentSlide].classList.add('active');
    textSlides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 6000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Initialize slider
if (document.querySelector('.hero-slide')) {
    startSlider();
    
    // Pause on hover
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', stopSlider);
    hero.addEventListener('mouseleave', startSlider);
}

// ============ STATS COUNTER ============
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!target) return;
        
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ============ INTERSECTION OBSERVER ============
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe project cards and other animated elements
document.addEventListener('DOMContentLoaded', () => {
    // Project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        animateOnScroll.observe(card);
    });
    
    // Diff cards
    document.querySelectorAll('.diff-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.08}s`;
        card.classList.add('project-card'); // reuse animation class
        animateOnScroll.observe(card);
    });
    
    // Amenity cards
    document.querySelectorAll('.amenity-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
        card.classList.add('project-card');
        animateOnScroll.observe(card);
    });
});

// Stats counter trigger
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============ TESTIMONIALS CAROUSEL ============
let testimonialIndex = 0;

function moveTestimonials(direction) {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    const cardWidth = cards[0].offsetWidth + 24; // card + gap
    const visibleCards = window.innerWidth <= 768 ? 1 : 2;
    const maxIndex = cards.length - visibleCards;
    
    testimonialIndex += direction;
    
    if (testimonialIndex < 0) testimonialIndex = 0;
    if (testimonialIndex > maxIndex) testimonialIndex = 0; // loop back
    
    track.style.transform = `translateX(-${testimonialIndex * cardWidth}px)`;
}

// Auto-scroll testimonials
let testimonialInterval;

function startTestimonialAutoScroll() {
    testimonialInterval = setInterval(() => {
        moveTestimonials(1);
    }, 5000);
}

function stopTestimonialAutoScroll() {
    clearInterval(testimonialInterval);
}

const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
if (testimonialsWrapper) {
    startTestimonialAutoScroll();
    testimonialsWrapper.addEventListener('mouseenter', stopTestimonialAutoScroll);
    testimonialsWrapper.addEventListener('mouseleave', startTestimonialAutoScroll);
}

// ============ ENQUIRY MODAL ============
function openEnquiryModal() {
    document.getElementById('enquiryModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
    document.getElementById('enquiryModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeEnquiryModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEnquiryModal();
    }
});

// ============ FORM HANDLING ============
const FORMSPREE_URL = 'https://formspree.io/f/xqedevwd';
const WHATSAPP_NUMBER = '919443029094';

// Send data to Formspree (email notification)
function sendToFormspree(data) {
    return fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Open WhatsApp with form data
function sendToWhatsApp(data) {
    const lines = [
        `*New Enquiry from RK Promoters Website*`,
        ``,
        `*Name:* ${data.name || 'N/A'}`,
        `*Phone:* ${data.phone || 'N/A'}`,
        `*Email:* ${data.email || 'N/A'}`,
        `*Project:* ${data.project || 'Not specified'}`,
        `*Message:* ${data.message || 'No message'}`
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
}

// Extract form data from a form element
function getFormData(form) {
    const get = (sel) => {
        const el = form.querySelector(sel);
        return el ? el.value.trim() : '';
    };
    return {
        name: get('input[name="name"], input[placeholder*="Name"]'),
        phone: get('input[name="phone"], input[type="tel"], input[placeholder*="Phone"]'),
        email: get('input[name="email"], input[type="email"], input[placeholder*="Email"]'),
        project: get('select') || '',
        message: get('textarea') || ''
    };
}

function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    const data = getFormData(form);
    
    // Loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    
    // Send to Formspree (email)
    sendToFormspree(data)
        .then(response => {
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.style.background = '#22c55e';
                btn.style.borderColor = '#22c55e';
                form.reset();
                
                // Also send to WhatsApp
                sendToWhatsApp(data);
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Formspree error');
            }
        })
        .catch(() => {
            // Even if Formspree fails, send via WhatsApp
            sendToWhatsApp(data);
            btn.innerHTML = '<i class="fas fa-check"></i> Sent via WhatsApp!';
            btn.style.background = '#25D366';
            btn.style.borderColor = '#25D366';
            form.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.disabled = false;
            }, 3000);
        });
}

function handleEnquirySubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const data = getFormData(form);
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;
    
    // Send to Formspree (email)
    sendToFormspree(data)
        .then(response => {
            // Show success message
            form.innerHTML = `
                <div class="success-message show">
                    <i class="fas fa-check-circle"></i>
                    <h4>Thank You!</h4>
                    <p>Your enquiry has been submitted successfully. We'll get back to you shortly.</p>
                </div>
            `;
            
            // Also send to WhatsApp
            sendToWhatsApp(data);
            
            setTimeout(() => {
                closeEnquiryModal();
                setTimeout(() => {
                    form.innerHTML = getEnquiryFormHTML();
                }, 500);
            }, 2500);
        })
        .catch(() => {
            // Fallback to WhatsApp only
            sendToWhatsApp(data);
            form.innerHTML = `
                <div class="success-message show">
                    <i class="fas fa-check-circle"></i>
                    <h4>Thank You!</h4>
                    <p>Your enquiry has been sent via WhatsApp. We'll contact you shortly.</p>
                </div>
            `;
            setTimeout(() => {
                closeEnquiryModal();
                setTimeout(() => {
                    form.innerHTML = getEnquiryFormHTML();
                }, 500);
            }, 2500);
        });
}

function getEnquiryFormHTML() {
    return `
        <div class="form-group">
            <input type="text" name="name" placeholder="Your Name *" required>
        </div>
        <div class="form-group">
            <input type="tel" name="phone" placeholder="Phone Number *" required>
        </div>
        <div class="form-group">
            <input type="email" name="email" placeholder="Email Address">
        </div>
        <div class="form-group">
            <select name="project">
                <option value="">Select Project (Optional)</option>
                <option value="RK Green City">RK Green City</option>
                <option value="RK Athiyan (Upcoming)">RK Athiyan (Upcoming)</option>
            </select>
        </div>
        <div class="form-group">
            <textarea name="message" placeholder="Your Message" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Submit Enquiry <i class="fas fa-arrow-right"></i></button>
    `;
}

// ============ SCROLL TO TOP ============
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============ PARALLAX EFFECT ============
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.stats-bg');
    parallaxElements.forEach(el => {
        const speed = 0.3;
        const yPos = -(window.scrollY * speed);
        el.style.transform = `translateY(${yPos}px)`;
    });
});

// ============ PROJECT DETAIL PAGE ============
// Load project data dynamically based on URL parameter
function getProjectFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project');
}

const projectsData = {
    'rk-green-city': {
        name: 'RK Green City',
        subtitle: "Nature's Haven for Your Dream Home",
        description: 'Premium Residential Plots',
        location: 'Molapalayam, Rasipuram',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
        badges: ['DTCP Approved', 'Bank Loan Available', 'Gated Community'],
        about: 'Welcome to RK Green City — a premium residential plot development nestled in the serene surroundings of Molapalayam, Rasipuram. Spread across lush green acres, this DTCP-approved project offers meticulously planned plots with world-class amenities. From landscaped gardens to well-laid tar roads, every aspect of RK Green City is designed to offer a life of comfort, convenience, and long-term value appreciation. Enjoy the perfect blend of nature and modern living with excellent connectivity to Rasipuram town and major landmarks.',
        amenities: [
            { icon: 'fas fa-shield-alt', name: 'Gated Community', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image1.jpg' },
            { icon: 'fas fa-video', name: 'CCTV Surveillance & Security', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image2.jpg' },
            { icon: 'fas fa-certificate', name: 'DTCP Approved', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image3.jpg' },
            { icon: 'fas fa-child', name: 'Safe Environment for Children', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image4.jpg' },
            { icon: 'fas fa-lightbulb', name: 'Street Lights', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image5.jpg' },
            { icon: 'fas fa-road', name: 'Well Laid Tar Roads', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image6.jpg' },
            { icon: 'fas fa-dungeon', name: 'Secured Compound Wall & Drainage', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image7.jpg' },
            { icon: 'fas fa-school', name: 'Near by Schools & Colleges', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image8.jpg' },
            { icon: 'fas fa-bolt', name: 'Electricity Facility', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image3.jpg' },
            { icon: 'fas fa-tint', name: 'Water Pipe Connection', img: 'https://www.venusestates.in/static/images/venus-avenue/amenities-image1.jpg' }
        ],
        sitePhotos: [
            { src: 'images/site-view-1.jpg', caption: 'Internal Roads' },
            { src: 'images/site-view-2.jpg', caption: 'Road Junction' },
            { src: 'images/site-view-3.jpg', caption: 'Road View' },
            { src: 'images/site-view-4.jpg', caption: 'Aerial View' }
        ],
        nearbyPlaces: [
            '2 km from Rasipuram Town',
            '1 km from NH-544 (Salem-Namakkal Highway)',
            '3 km from Rasipuram Bus Stand',
            '2 km from Government Hospital',
            '1.5 km from CBSE & Matriculation Schools',
            '2 km from Namakkal Anjaneyar Temple',
            '1 km from Petrol Pump',
            '500m from Local Market',
            '4 km from Namakkal Town',
            '3 km from Rasipuram Railway Station'
        ]
    }
};

// Initialize project detail page
function initProjectDetail() {
    const projectId = getProjectFromURL();
    if (!projectId || !projectsData[projectId]) return;
    
    const project = projectsData[projectId];
    
    // Update all text elements
    document.querySelectorAll('.project-name').forEach(el => el.textContent = project.name);
    document.querySelectorAll('.project-subtitle').forEach(el => el.textContent = project.subtitle);
    document.querySelectorAll('.project-description').forEach(el => el.textContent = project.description);
    document.querySelectorAll('.project-loc').forEach(el => el.textContent = project.location);
    
    const aboutEl = document.querySelector('.project-about-text');
    if (aboutEl) aboutEl.textContent = project.about;
    
    // Update banner image
    const bannerImg = document.querySelector('.pd-banner-img');
    if (bannerImg) bannerImg.src = project.image;
    
    // Update amenities (horizontal carousel with dot navigation)
    const amenitiesTrack = document.getElementById('amenitiesTrack');
    const amenitiesDots = document.getElementById('amenitiesDots');
    if (amenitiesTrack) {
        amenitiesTrack.innerHTML = project.amenities.map(a => `
            <div class="pd-amenity-card">
                <div class="pd-amenity-img">
                    <img src="${a.img}" alt="${a.name}">
                </div>
                <div class="pd-amenity-text">
                    <h5>${a.name}</h5>
                </div>
            </div>
        `).join('');
        
        // Calculate pages and create dots
        initAmenitiesCarousel();
    }
    
    // Update nearby places
    const locationList = document.querySelector('.location-list ul');
    if (locationList) {
        locationList.innerHTML = project.nearbyPlaces.map(p => `
            <li><i class="fas fa-map-pin"></i> ${p}</li>
        `).join('');
    }
    
    // Update page title
    document.title = `${project.name} - RK Promoters`;
    
    // Update site photos (horizontal scrolling gallery like Venus Estates)
    const sitePhotosTrack = document.querySelector('.pd-site-photos-track');
    if (sitePhotosTrack && project.sitePhotos) {
        // Duplicate photos for seamless infinite scroll
        const photosHTML = project.sitePhotos.map(p => `
            <div class="pd-scroll-photo" onclick="openLightbox(this)">
                <img src="${p.src}" alt="${p.caption}">
            </div>
        `).join('');
        sitePhotosTrack.innerHTML = photosHTML + photosHTML;
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    initProjectDetail();
});

// ============ TOUCH SWIPE FOR TESTIMONIALS ============
let touchStartX = 0;
let touchEndX = 0;

const testimonialTrack = document.getElementById('testimonialsTrack');
if (testimonialTrack) {
    testimonialTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    testimonialTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            moveTestimonials(1);
        } else if (touchEndX - touchStartX > 50) {
            moveTestimonials(-1);
        }
    });
}

// ============ SITE VIEW CAROUSEL ============
let siteViewCurrent = 0;

function changeSiteView(dir) {
    const slides = document.querySelectorAll('.pd-siteview-slide');
    if (!slides.length) return;
    siteViewCurrent += dir;
    if (siteViewCurrent < 0) siteViewCurrent = slides.length - 1;
    if (siteViewCurrent >= slides.length) siteViewCurrent = 0;
    goToSiteView(siteViewCurrent);
}

function goToSiteView(index) {
    const slides = document.querySelectorAll('.pd-siteview-slide');
    const dots = document.querySelectorAll('.pd-siteview-dots .pd-dot');
    if (!slides.length) return;
    siteViewCurrent = index;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

// Auto-advance site view
let siteViewAutoInterval;
function startSiteViewAuto() {
    siteViewAutoInterval = setInterval(() => changeSiteView(1), 4000);
}
function stopSiteViewAuto() {
    clearInterval(siteViewAutoInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    const siteViewEl = document.querySelector('.pd-siteview-carousel');
    if (siteViewEl) {
        startSiteViewAuto();
        siteViewEl.addEventListener('mouseenter', stopSiteViewAuto);
        siteViewEl.addEventListener('mouseleave', startSiteViewAuto);
    }
});

// ============ AMENITIES CAROUSEL ============
let amenitiesCurrentPage = 0;
let amenitiesTotalPages = 1;

function initAmenitiesCarousel() {
    const track = document.getElementById('amenitiesTrack');
    const dotsContainer = document.getElementById('amenitiesDots');
    if (!track || !dotsContainer) return;
    
    const cards = track.querySelectorAll('.pd-amenity-card');
    const perPage = getAmenitiesPerPage();
    amenitiesTotalPages = Math.ceil(cards.length / perPage);
    amenitiesCurrentPage = 0;
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < amenitiesTotalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'pd-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToAmenityPage(i);
        dotsContainer.appendChild(dot);
    }
    
    goToAmenityPage(0);
}

function getAmenitiesPerPage() {
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 992) return 3;
    return 5;
}

function goToAmenityPage(page) {
    const track = document.getElementById('amenitiesTrack');
    const dotsContainer = document.getElementById('amenitiesDots');
    if (!track) return;
    
    const cards = track.querySelectorAll('.pd-amenity-card');
    const perPage = getAmenitiesPerPage();
    const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 0; // card width + gap
    const maxPage = Math.ceil(cards.length / perPage) - 1;
    
    if (page < 0) page = maxPage;
    if (page > maxPage) page = 0;
    
    amenitiesCurrentPage = page;
    const offset = page * perPage * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    if (dotsContainer) {
        dotsContainer.querySelectorAll('.pd-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === page);
        });
    }
}

// Auto-advance amenities carousel
let amenitiesAutoInterval;
function startAmenitiesAuto() {
    amenitiesAutoInterval = setInterval(() => {
        goToAmenityPage(amenitiesCurrentPage + 1);
    }, 4000);
}
function stopAmenitiesAuto() {
    clearInterval(amenitiesAutoInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.pd-amenities-carousel');
    if (carousel) {
        startAmenitiesAuto();
        carousel.addEventListener('mouseenter', stopAmenitiesAuto);
        carousel.addEventListener('mouseleave', startAmenitiesAuto);
    }
});

// Recalculate on resize
window.addEventListener('resize', () => {
    const track = document.getElementById('amenitiesTrack');
    if (track && track.children.length > 0) {
        initAmenitiesCarousel();
    }
});

// ============ LIGHTBOX ============
function openLightbox(el) {
    const img = el.querySelector('img');
    if (!img) return;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src.replace('w=400', 'w=1200').replace('w=600', 'w=1200');
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ============ LAZY LOADING IMAGES ============
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imgObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });
}

// ============ PREMIUM SCROLL REVEAL SYSTEM ============
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    // Observe all elements with .reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Auto-add reveal to common elements if not already added
    const autoRevealSelectors = [
        '.section-header',
        '.about-grid > *',
        '.contact-info',
        '.contact-form-wrapper',
        '.stat-item',
        '.vm-card',
        '.diff-card',
        '.team-card'
    ];
    
    autoRevealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                el.style.transitionDelay = `${index * 0.1}s`;
                revealObserver.observe(el);
            }
        });
    });
});

// ============ PREMIUM TILT EFFECT ON CARDS ============
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.project-card, .advantage-card, .testimonial-card, .vm-card, .pd-badge-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

document.addEventListener('DOMContentLoaded', initTiltEffect);

// ============ PREMIUM SMOOTH NUMBER COUNTER ============
// Override the basic counter with an eased version
function animateCountersPremium() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!target) return;
        
        const duration = 2500;
        const startTime = performance.now();
        
        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.floor(easedProgress * target);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

// Replace the old stats observer with premium version
const premiumStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCountersPremium();
            premiumStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
    const statsEl = document.querySelector('.stats-section');
    if (statsEl) {
        premiumStatsObserver.observe(statsEl);
    }
});

// ============ PREMIUM PARALLAX LAYERS ============
let parallaxTick = false;

window.addEventListener('scroll', () => {
    if (!parallaxTick) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // Parallax on decorative elements
            document.querySelectorAll('.deco-parallax').forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.15;
                const rect = el.parentElement.getBoundingClientRect();
                const visible = rect.top < window.innerHeight && rect.bottom > 0;
                if (visible) {
                    const yPos = (rect.top - window.innerHeight / 2) * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
            
            // Parallax on hero content (subtle)
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrollY < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroContent.style.opacity = 1 - (scrollY / window.innerHeight * 0.6);
            }
            
            parallaxTick = false;
        });
        parallaxTick = true;
    }
});

// ============ MAGNETIC BUTTON EFFECT ============
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-enquiry, .floating-enquiry');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

document.addEventListener('DOMContentLoaded', initMagneticButtons);

// ============ TYPING TEXT EFFECT IN HERO ============
function initTypingEffect() {
    const heroSubtexts = document.querySelectorAll('.hero p');
    heroSubtexts.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 600);
                    observer.unobserve(el);
                }
            });
        });
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', initTypingEffect);

// ============ PROJECT FILTER DROPDOWN & TABS ============
function toggleFilterDropdown() {
    const btn = document.getElementById('filterDropdownBtn');
    const menu = document.getElementById('filterDropdownMenu');
    if (!btn || !menu) return;
    
    btn.classList.toggle('open');
    menu.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('projectFilterDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        const btn = document.getElementById('filterDropdownBtn');
        const menu = document.getElementById('filterDropdownMenu');
        if (btn) btn.classList.remove('open');
        if (menu) menu.classList.remove('open');
    }
});

function filterProjects(category, clickedBtn) {
    const cards = document.querySelectorAll('.project-filter-card');
    
    // Show/hide cards based on category
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.classList.remove('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            // Animate in
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Update active state for desktop tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-filter') === category) {
            tab.classList.add('active');
        }
    });
    
    // Update active state for mobile dropdown
    document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-filter') === category) {
            option.classList.add('active');
        }
    });
    
    // Update dropdown label
    const filterLabel = document.getElementById('filterLabel');
    if (filterLabel) {
        const labels = {
            'all': 'All Projects',
            'ongoing': 'Ongoing',
            'completed': 'Completed',
            'upcoming': 'Upcoming'
        };
        filterLabel.textContent = labels[category] || 'All Projects';
    }
    
    // Close dropdown menu
    const btn = document.getElementById('filterDropdownBtn');
    const menu = document.getElementById('filterDropdownMenu');
    if (btn) btn.classList.remove('open');
    if (menu) menu.classList.remove('open');
}

// ============ SMOOTH IMAGE LOADING ============
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) return;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });
});
