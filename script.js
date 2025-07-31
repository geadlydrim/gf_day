// Slide configuration - modify this to add your content
const slideConfig = [
    {
        type: 'photo',
        title: 'Happy National GF Day!',
        description: 'To my dearest, my lover, my favorite person.',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        duration: 20000, // 3 seconds for photos
        music: './audio/1.mp3', // Optional: path to background music
        time: 144,
        src: './images/1.png' // Optional: path to image
    },
    {
        type: 'photo',
        title: 'Your First Picture',
        description: 'And one of my favorites.',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        duration: 20000,
        music: './audio/2.mp3',
        time: 20,
        src: './images/2.JPG'
    },
    {
        type: 'photo',
        title: 'My Favorite Subject',
        description: 'I take bad portraits, but you make them look good. You\'re as lovely as a field of flowers.',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        duration: 20000,
        music: './audio/3.mp3',
        time: 46,
        src: './images/3.png'
    },
    {
        type: 'photo',
        title: 'Your Eyes Are Like The Sun',
        description: 'And my eyes are the sunflowers. Like moth to a flame, I\'m eternally drawn to you.',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        duration: 20000,
        music: './audio/4.mp3',
        time: 11,
        src: './images/4.png'
    },
    {
        type: 'photo',
        title: 'I\'m So Proud Of You',
        description: 'Of all your success and failures, pains and comforts, mistakes and growth.',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        duration: 20000,
        music: './audio/5.mp3',
        time: 102,
        src: './images/5.jpg'
    },
    {
        type: 'photo',
        title: 'I Love You',
        description: 'I am truly grateful to have you, and I love you more than words can say. I dedicate this day to you. Happy National Girlfriend Day!',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        duration: 20000,
        music: './audio/6.mp3',
        time: 74,
        src: './images/6.png'
    },
];

class SlideShow {
    constructor() {
        this.currentSlide = 0;
        this.isPlaying = false;
        this.slides = slideConfig;
        this.autoAdvanceTimer = null;
        this.progressStartTime = null;
        this.progressPausedTime = 0;
        this.progressAnimationId = null;
        this.currentAudio = null;
        
        this.init();
    }
    
    init() {
        this.renderSlides();
        this.renderStoryProgress();
        this.bindEvents();
        this.showSlide(0);
        this.startAutoAdvance();
    }
    
    renderSlides() {
        const wrapper = document.getElementById('slidesWrapper');
        wrapper.innerHTML = '';
        
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.setAttribute('data-index', index);
            
            if (slide.type === 'photo') {
                slideElement.innerHTML = this.createPhotoSlide(slide);
            } else if (slide.type === 'video') {
                slideElement.innerHTML = this.createVideoSlide(slide);
            }
            
            wrapper.appendChild(slideElement);
        });
    }
    
    createPhotoSlide(slide) {
        if (slide.src) {
            return `
                <img src="${slide.src}" alt="${slide.title}">
                <div class="slide-content">
                    <h2 class="slide-title">${slide.title}</h2>
                    <p class="slide-description">${slide.description}</p>
                </div>
                ${slide.music ? `<div class="audio-player">
                    <div class="audio-info">
                        <i class="fas fa-music audio-icon"></i>
                        <span>Playing background music</span>
                    </div>
                </div>` : ''}
            `;
        } else {
            // Placeholder photo slide
            return `
                <div class="placeholder-slide" style="background: ${slide.background}">
                    <i class="fas fa-music music-icon"></i>
                    <h2>${slide.title}</h2>
                    <p>${slide.description}</p>
                </div>
            `;
        }
    }
    
    createVideoSlide(slide) {
        if (slide.src && !slide.placeholder) {
            return `
                <video autoplay loop>
                    <source src="${slide.src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="slide-content">
                    <h2 class="slide-title">${slide.title}</h2>
                    <p class="slide-description">${slide.description}</p>
                </div>
            `;
        } else {
            // Placeholder video slide
            return `
                <div class="placeholder-slide" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    <i class="fas fa-play-circle video-icon"></i>
                    <h2>${slide.title}</h2>
                    <p>${slide.description}</p>
                </div>
            `;
        }
    }
    
    renderStoryProgress() {
        const progressContainer = document.getElementById('storyProgress');
        progressContainer.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const bar = document.createElement('div');
            bar.className = 'story-bar';
            bar.innerHTML = '<div class="story-bar-fill"></div>';
            progressContainer.appendChild(bar);
        });
    }
    
    bindEvents() {
        // Desktop navigation buttons
        document.getElementById('desktopPrevBtn').addEventListener('click', () => this.previousSlide());
        document.getElementById('desktopNextBtn').addEventListener('click', () => this.nextSlide());
        
        // Mobile navigation areas
        document.getElementById('leftNavArea').addEventListener('click', () => this.previousSlide());
        document.getElementById('rightNavArea').addEventListener('click', () => this.nextSlide());
        
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
            }
        });
        
        // Touch gestures
        let startX = 0;
        const container = document.querySelector('.slideshow-container');
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
    
    showSlide(index) {
        // Hide all slides
        document.querySelectorAll('.slide').forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        const currentSlideElement = document.querySelector(`[data-index="${index}"]`);
        currentSlideElement.classList.add('active');
        
        // Reset all progress bars
        this.resetProgressBars();
        
        // Handle slide-specific logic
        const slide = this.slides[index];
        this.handleSlideMedia(slide, currentSlideElement);
        
        // Start progress bar animation
        this.startStoryProgress();
    }
    
    handleSlideMedia(slide, element) {
        // Stop any current audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        
        // Stop and reset ALL videos (not just active ones)
        document.querySelectorAll('video').forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        if (slide.type === 'video' && slide.src && !slide.placeholder) {
            const video = element.querySelector('video');
            if (video) {
                video.volume = 0.4; // Set volume to 60%
                video.currentTime = 0;
                
                // Only play video if slideshow is not paused
                if (this.isPlaying) {
                    video.play().catch(e => {
                        console.log('Video autoplay prevented:', e);
                        // If autoplay fails, try to play without sound first
                        video.muted = true;
                        video.play().then(() => {
                            // Once playing, try to unmute
                            setTimeout(() => {
                                video.muted = false;
                            }, 100);
                        });
                    });
                } else {
                    // If paused, ensure video is paused
                    video.pause();
                }
            }
        }
        
        if (slide.music) {
            this.currentAudio = new Audio(slide.music);
            if (slide.time) {
                this.currentAudio.currentTime = slide.time; // Start at specific time if provided
            }
            this.currentAudio.volume = 0.3; // Set volume to 60%
            this.currentAudio.loop = true;
            
            // Only play audio if slideshow is not paused
            if (this.isPlaying) {
                this.currentAudio.play().catch(e => console.log('Audio autoplay prevented'));
            }
        }
    }
    
    resetProgressBars() {
        document.querySelectorAll('.story-bar').forEach((bar, i) => {
            const fill = bar.querySelector('.story-bar-fill');
            fill.style.transition = 'none';
            
            if (i < this.currentSlide) {
                // Completed slides
                fill.style.width = '100%';
            } else if (i === this.currentSlide) {
                // Current slide - start from 0%
                fill.style.width = '0%';
            } else {
                // Future slides
                fill.style.width = '0%';
            }
        });
    }
    
    startStoryProgress() {
        const currentBar = document.querySelectorAll('.story-bar')[this.currentSlide];
        const fill = currentBar.querySelector('.story-bar-fill');
        const slide = this.slides[this.currentSlide];
        let duration = slide.duration || 5000; // Default 5 seconds
        
        // For video slides, try to get video duration
        if (slide.type === 'video' && !slide.placeholder) {
            const videoElement = document.querySelector('.slide.active video');
            if (videoElement && videoElement.duration) {
                duration = videoElement.duration * 1000; // Convert to milliseconds
            }
        }
        
        // Reset progress tracking
        this.progressStartTime = Date.now();
        this.progressPausedTime = 0;
        
        // Start smooth progress animation
        this.animateProgress(fill, duration);
    }
    
    animateProgress(fill, totalDuration) {
        const animate = () => {
            if (!this.isPlaying) return; // Stop animation if paused
            
            const elapsed = Date.now() - this.progressStartTime - this.progressPausedTime;
            const progress = Math.min(elapsed / totalDuration, 1);
            
            fill.style.width = `${progress * 100}%`;
            
            if (progress < 1) {
                this.progressAnimationId = requestAnimationFrame(animate);
            }
        };
        
        // Start animation
        fill.style.transition = 'none';
        this.progressAnimationId = requestAnimationFrame(animate);
    }
    
    startAutoAdvance() {
        if (!this.isPlaying) return;
        
        const slide = this.slides[this.currentSlide];
        let duration = slide.duration || 5000;
        
        // For video slides, try to get actual duration
        if (slide.type === 'video' && !slide.placeholder) {
            const videoElement = document.querySelector('.slide.active video');
            if (videoElement && videoElement.duration) {
                duration = videoElement.duration * 1000;
            }
        }
        
        this.autoAdvanceTimer = setTimeout(() => {
            this.nextSlide();
        }, duration);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
        
        if (this.progressAnimationId) {
            cancelAnimationFrame(this.progressAnimationId);
            this.progressAnimationId = null;
        }
    }
    
    nextSlide() {
        this.stopAutoAdvance();
        
        // Complete current progress bar instantly
        if (this.currentSlide < this.slides.length) {
            const currentBar = document.querySelectorAll('.story-bar')[this.currentSlide];
            const fill = currentBar.querySelector('.story-bar-fill');
            fill.style.transition = 'none';
            fill.style.width = '100%';
        }
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        
        // If we've looped back to the beginning, reset all progress bars
        if (this.currentSlide === 0) {
            setTimeout(() => {
                document.querySelectorAll('.story-bar').forEach(bar => {
                    const fill = bar.querySelector('.story-bar-fill');
                    fill.style.transition = 'none';
                    fill.style.width = '0%';
                });
            }, 50);
        }
        
        this.showSlide(this.currentSlide);
        if (this.isPlaying) {
            this.startAutoAdvance();
        }
    }
    
    previousSlide() {
        this.stopAutoAdvance();
        
        // Clear current progress bar
        const currentBar = document.querySelectorAll('.story-bar')[this.currentSlide];
        const currentFill = currentBar.querySelector('.story-bar-fill');
        currentFill.style.transition = 'none';
        currentFill.style.width = '0%';
        
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        
        // Clear the previous slide's progress bar too
        const prevBar = document.querySelectorAll('.story-bar')[this.currentSlide];
        const prevFill = prevBar.querySelector('.story-bar-fill');
        prevFill.style.transition = 'none';
        prevFill.style.width = '0%';
        
        this.showSlide(this.currentSlide);
        if (this.isPlaying) {
            this.startAutoAdvance();
        }
    }
    
    goToSlide(index) {
        this.stopAutoAdvance();
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
        if (this.isPlaying) {
            this.startAutoAdvance();
        }
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById('playPauseBtn');
        const icon = btn.querySelector('i');
        const container = document.querySelector('.slideshow-container');
        const currentBar = document.querySelectorAll('.story-bar')[this.currentSlide];
        const fill = currentBar.querySelector('.story-bar-fill');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
            container.classList.remove('paused');
            
            // Resume any paused media
            const activeVideo = document.querySelector('.slide.active video');
            if (activeVideo) {
                activeVideo.play().catch(e => {
                    console.log('Video resume prevented:', e);
                    // Try with muted first if needed
                    activeVideo.muted = true;
                    activeVideo.play().then(() => {
                        setTimeout(() => {
                            activeVideo.muted = false;
                        }, 100);
                    });
                });
            }
            if (this.currentAudio) {
                this.currentAudio.play().catch(e => console.log('Audio resume prevented'));
            }
            
            // Resume progress and timer from where we left off
            const currentWidth = parseFloat(fill.style.width) || 0;
            if (currentWidth < 100) {
                const slide = this.slides[this.currentSlide];
                const duration = slide.duration || 5000;
                const remainingTime = duration * (1 - currentWidth / 100);
                
                // Update start time to account for pause
                this.progressStartTime = Date.now() - (currentWidth / 100) * duration;
                this.progressPausedTime = 0;
                
                // Resume progress animation
                this.animateProgress(fill, duration);
                
                // Resume auto advance timer
                this.autoAdvanceTimer = setTimeout(() => {
                    this.nextSlide();
                }, remainingTime);
            }
        } else {
            icon.className = 'fas fa-play';
            container.classList.add('paused');
            this.stopAutoAdvance();
            
            // Pause any playing media
            const activeVideo = document.querySelector('.slide.active video');
            if (activeVideo) activeVideo.pause();
            if (this.currentAudio) this.currentAudio.pause();
            
            // Record pause time for accurate resume
            if (this.progressStartTime) {
                this.progressPausedTime += Date.now() - this.progressStartTime;
            }
        }
    }
}

// Initialize the slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SlideShow();
});

// Export configuration for easy modification
window.SlideConfig = slideConfig;