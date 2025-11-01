// 부드러운 스크롤 네비게이션
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 링크 클릭 시 부드러운 스크롤
    const navLinks = document.querySelectorAll('.nav-list a, .btn-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 앵커 링크인 경우만 처리
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('.floating-nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 스크롤 시 네비게이션 강조
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-list a');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // 스크롤 시 네비게이션 스타일 변경
    const floatingNav = document.querySelector('.floating-nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            floatingNav.style.position = 'sticky';
            floatingNav.style.top = '20px';
        } else {
            floatingNav.style.position = 'relative';
            floatingNav.style.top = '0';
        }

        lastScrollTop = scrollTop;
    });

    // 히어로 섹션 패럴랙스 효과
    const hero = document.querySelector('.hero');
    const heroMedia = document.querySelector('.hero-media');

    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        if (scrollPosition < window.innerHeight) {
            heroMedia.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });

    // 카드 애니메이션 (스크롤 시 나타나기)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 모든 카드와 섹션에 애니메이션 적용
    const animatedElements = document.querySelectorAll('.feature-card, .benefit-item, .company-content, .cs-info');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // 히어로 콘텐츠 페이드인 애니메이션
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});
