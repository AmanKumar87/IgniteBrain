document.addEventListener("DOMContentLoaded", () => {
  // --- NAVBAR LOGIC ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  const accordionButtons = document.querySelectorAll("[data-accordion-button]");
  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const submenu = button.nextElementSibling;
      const icon = button.querySelector("svg");
      const isExpanded =
        submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

      accordionButtons.forEach((otherButton) => {
        if (otherButton !== button) {
          const otherSubmenu = otherButton.nextElementSibling;
          const otherIcon = otherButton.querySelector("svg");
          otherSubmenu.style.maxHeight = null;
          otherIcon.style.transform = "rotate(0deg)";
        }
      });

      if (isExpanded) {
        submenu.style.maxHeight = null;
        icon.style.transform = "rotate(0deg)";
      } else {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
        icon.style.transform = "rotate(90deg)";
      }
    });
  });

  // --- HERO SLIDESHOW LOGIC (REVISED FOR SLIDING CARDS) ---
  const heroSlideshow = document.getElementById("hero-slideshow");
  if (heroSlideshow) {
    const slides = heroSlideshow.querySelectorAll(".hero-card-slide");
    let currentSlide = 0;
    const totalSlides = slides ? slides.length : 0;

    if (totalSlides > 1) {
      setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        const offset = -currentSlide * 100;
        heroSlideshow.style.transform = `translateX(${offset}%)`;
      }, 5000); // Change slide every 5 seconds
    }
  }

  // --- LEARNING ROADMAP ANIMATION LOGIC (NEW) ---
  const roadmapSection = document.getElementById("roadmap-section");
  if (roadmapSection) {
    const timelineItems = roadmapSection.querySelectorAll(".timeline-item");
    const roadmapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add the class to start the line animation
            roadmapSection.classList.add("is-visible");

            // Stagger the animation for each card
            timelineItems.forEach((item, index) => {
              // We set the animation delay via inline style
              item.style.animationDelay = `${0.3 + index * 0.2}s`;
            });

            // We can unobserve after the animation starts to save resources
            roadmapObserver.unobserve(roadmapSection);
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );
    roadmapObserver.observe(roadmapSection);
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

    if (nextButton && prevButton) {
      nextButton.addEventListener("click", () => {
        nextSlide();
        resetSlideShow();
      });
      prevButton.addEventListener("click", () => {
        prevSlide();
        resetSlideShow();
      });
    }

    showSlide(currentSlide);
    startSlideShow();
  }

  // --- FAQ ACCORDION LOGIC ---
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((otherItem) => {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer").style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }

  // --- OLYMPIAD CARD SCROLL ANIMATION ---
  const cardsToAnimate = document.querySelectorAll(
    ".olympiad-card-new, .olympiad-featured-card"
  );

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, index * 150);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  cardsToAnimate.forEach((card) => {
    cardObserver.observe(card);
  });

  // --- FEATURED CARD SLIDESHOW LOGIC ---
  const featuredSlides = document.querySelectorAll(".featured-card-slide");
  let currentFeaturedSlide = 0;

  if (featuredSlides.length > 0) {
    featuredSlides[0].classList.add("active");
    setInterval(() => {
      featuredSlides[currentFeaturedSlide].classList.remove("active");
      currentFeaturedSlide = (currentFeaturedSlide + 1) % featuredSlides.length;
      featuredSlides[currentFeaturedSlide].classList.add("active");
    }, 5000);
  }
});
