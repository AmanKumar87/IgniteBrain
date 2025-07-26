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
  // --- WELCOME SECTION CARD ANIMATION ---
  const welcomeSection = document.querySelector(".lg\\:col-span-2.grid"); // Target the grid containing the cards
  if (welcomeSection) {
    const cardsToAnimate =
      welcomeSection.querySelectorAll(".olympiad-card-new");
    const featuredCard = document.querySelector(
      ".lg\\:col-span-1.bg-gradient-to-br"
    ); // Target the featured card separately

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate the 4 grid cards with a stagger
            cardsToAnimate.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("is-visible");
              }, index * 150); // 150ms delay between each card
            });
            // Animate the featured card
            if (featuredCard) {
              setTimeout(() => {
                featuredCard.classList.add("is-visible");
              }, 150); // Give it a small delay
            }
            cardObserver.unobserve(entry.target); // Stop observing after animation starts
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
      }
    );

    cardObserver.observe(welcomeSection);
  }

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
  // --- STATS SECTION ICON ANIMATION ---
  const statIcons = document.querySelectorAll(".stat-icon-container");
  if (statIcons.length > 0) {
    let currentIconIndex = 0;
    setInterval(() => {
      // Remove animation from the previously animated icon
      if (statIcons[currentIconIndex]) {
        statIcons[currentIconIndex].classList.remove("animating");
      }

      // Move to the next icon, looping back to the start
      currentIconIndex = (currentIconIndex + 1) % statIcons.length;

      // Add animation to the new current icon
      if (statIcons[currentIconIndex]) {
        statIcons[currentIconIndex].classList.add("animating");
      }
    }, 1000); // Change icon every 1 second
  }
  // --- SKILL TRACKS SECTION CARD ANIMATION ---
  const skillTracksSection = document.getElementById("skill-tracks-section");
  if (skillTracksSection) {
    const cardsToAnimate = skillTracksSection.querySelectorAll(
      ".skill-card-animate"
    );

    const skillCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardsToAnimate.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("is-visible");
              }, index * 150); // Staggered delay
            });
            skillCardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    skillCardObserver.observe(skillTracksSection);
  }
  // --- CODE LAB PAGE LOGIC ---
  if (document.getElementById("lab-page-container")) {
    // A simple check to see if we're on the lab page
    // Initialize CodeMirror Editors
    const htmlEditor = CodeMirror.fromTextArea(
      document.getElementById("html-code"),
      {
        mode: "xml",
        theme: "material-darker",
        lineNumbers: true,
        autoCloseTags: true,
      }
    );
    const cssEditor = CodeMirror.fromTextArea(
      document.getElementById("css-code"),
      {
        mode: "css",
        theme: "material-darker",
        lineNumbers: true,
        autoCloseBrackets: true,
      }
    );
    const jsEditor = CodeMirror.fromTextArea(
      document.getElementById("js-code"),
      {
        mode: "javascript",
        theme: "material-darker",
        lineNumbers: true,
        autoCloseBrackets: true,
      }
    );
    const singleEditor = CodeMirror.fromTextArea(
      document.getElementById("single-code"),
      {
        mode: "python",
        theme: "material-darker",
        lineNumbers: true,
        autoCloseBrackets: true,
      }
    );

    const languageTabs = document.getElementById("language-tabs");
    const runCodeBtn = document.getElementById("run-code-btn");
    const webEditor = document.getElementById("web-editor");
    const singleEditorContainer = document.getElementById("single-editor");
    const singleEditorHeader = document.getElementById("single-editor-header");
    const previewFrame = document.getElementById("preview-frame");
    const outputConsole = document.getElementById("output-console");

    let currentLanguage = "web";

    // Function to switch between languages
    languageTabs.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const lang = e.target.dataset.lang;
        if (lang === currentLanguage) return;

        // Update active tab
        languageTabs.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");

        currentLanguage = lang;

        if (lang === "web") {
          webEditor.classList.remove("hidden");
          singleEditorContainer.classList.add("hidden");
          previewFrame.classList.remove("hidden");
          outputConsole.classList.add("hidden");
        } else {
          webEditor.classList.add("hidden");
          singleEditorContainer.classList.remove("hidden");
          previewFrame.classList.add("hidden");
          outputConsole.classList.remove("hidden");

          // Update single editor mode and header
          let mode = "python";
          let headerText = "Python";
          if (lang === "cpp") {
            mode = "text/x-c++src";
            headerText = "C++";
          } else if (lang === "c") {
            mode = "text/x-csrc";
            headerText = "C";
          } else if (lang === "java") {
            mode = "text/x-java";
            headerText = "Java";
          }

          singleEditor.setOption("mode", mode);
          singleEditorHeader.textContent = headerText;
          outputConsole.textContent = `Running ${headerText} code is a complex backend operation.\nThis is a UI demonstration. Press "Run Code" to see a sample output.`;
        }
      }
    });

    // Function to run the code
    runCodeBtn.addEventListener("click", () => {
      if (currentLanguage === "web") {
        const htmlCode = htmlEditor.getValue();
        const cssCode = `<style>${cssEditor.getValue()}</style>`;
        const jsCode = `<script>${jsEditor.getValue()}<\/script>`;
        const combinedCode = `${htmlCode}${cssCode}${jsCode}`;

        const previewDoc = previewFrame.contentWindow.document;
        previewDoc.open();
        previewDoc.write(combinedCode);
        previewDoc.close();
      } else {
        // NOTE: Actually compiling C++, Java, Python requires a server-side backend.
        // This is a front-end simulation for demonstration purposes.
        const langName = languageTabs.querySelector(".active").textContent;
        outputConsole.textContent = `Simulating output for ${langName}...\n\nHello, Ignite Brain!\nProcess finished successfully.`;
      }
    });
  }
});
