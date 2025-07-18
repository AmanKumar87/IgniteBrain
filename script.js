// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
  // --- NAVBAR LOGIC ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileAboutButton = document.getElementById("mobile-about-button");
  const mobileAboutSubmenu = document.getElementById("mobile-about-submenu");
  const mobileAboutIcon = document.getElementById("mobile-about-icon");

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  if (mobileAboutButton) {
    mobileAboutButton.addEventListener("click", () => {
      const isHidden = mobileAboutSubmenu.classList.contains("hidden");
      if (isHidden) {
        mobileAboutSubmenu.classList.remove("hidden");
        mobileAboutSubmenu.style.maxHeight =
          mobileAboutSubmenu.scrollHeight + "px";
        mobileAboutIcon.style.transform = "rotate(90deg)";
      } else {
        mobileAboutSubmenu.style.maxHeight = "0";
        mobileAboutIcon.style.transform = "rotate(0deg)";
        setTimeout(() => {
          mobileAboutSubmenu.classList.add("hidden");
        }, 400);
      }
    });
  }

  // --- HERO SLIDESHOW LOGIC ---
  const heroSlides = document.querySelectorAll(".hero-slide");
  let currentHeroSlide = 0;
  if (heroSlides.length > 0) {
    setInterval(() => {
      heroSlides[currentHeroSlide].classList.remove("active");
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
      heroSlides[currentHeroSlide].classList.add("active");
    }, 8000);
  }

  // --- STATS COUNTER ANIMATION LOGIC ---
  const counters = document.querySelectorAll("#stats-section [data-target]");
  const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    const speed = 200;
    const updateCount = () => {
      const count = +counter.innerText.replace(/,/g, "");
      const increment = target / speed;
      if (count < target) {
        const newCount = count + increment;
        if (target % 1 !== 0) {
          counter.innerText = newCount.toFixed(1);
        } else {
          counter.innerText = Math.ceil(newCount).toLocaleString();
        }
        setTimeout(updateCount, 15);
      } else {
        counter.innerText =
          target % 1 !== 0 ? target.toFixed(1) : target.toLocaleString();
      }
    };
    updateCount();
  };

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((counter) => statsObserver.observe(counter));

  // --- LEARNING TREE ANIMATION LOGIC ---
  const learningTreeSection = document.getElementById("learning-tree-section");
  if (learningTreeSection) {
    const learningTreeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            learningTreeSection.classList.add("in-view");
            observer.unobserve(learningTreeSection);
          }
        });
      },
      { threshold: 0.2 }
    );
    learningTreeObserver.observe(learningTreeSection);
  }

  // --- CREATOR'S TOOLKIT SLIDESHOW LOGIC ---
  const slides = document.querySelectorAll("#creator-toolkit-slideshow .slide");
  const prevButton = document.getElementById("prev-slide");
  const nextButton = document.getElementById("next-slide");
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0) {
    const showSlide = (index) => {
      slides.forEach((slide, i) =>
        slide.classList.toggle("active", i === index)
      );
    };
    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };
    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };
    const startSlideShow = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };
    const resetSlideShow = () => {
      clearInterval(slideInterval);
      startSlideShow();
    };

    nextButton.addEventListener("click", () => {
      nextSlide();
      resetSlideShow();
    });
    prevButton.addEventListener("click", () => {
      prevSlide();
      resetSlideShow();
    });

    showSlide(currentSlide);
    startSlideShow();
  }

  // --- FAQ ACCORDION LOGIC ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach((otherItem) => otherItem.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
  // --- JAVASCRIPT FOR FEATURED CARD SLIDESHOW ---
});
