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
  // --- STEPPER TIMELINE ROADMAP ANIMATION ---
  const stepperTimeline = document.getElementById("stepper-timeline");
  if (stepperTimeline) {
    const stepperItems = stepperTimeline.querySelectorAll(".stepper-item");

    const stepperObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stepperItems.forEach((item, index) => {
              // Add class with a staggered delay for a nice effect
              setTimeout(() => {
                item.classList.add("is-visible");
              }, index * 200); // 200ms delay between each item
            });
            stepperObserver.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    stepperObserver.observe(stepperTimeline);
  }
  // --- INTERACTIVE MIND MAP ROADMAP LOGIC ---
  const roadmapContainer = document.getElementById(
    "interactive-roadmap-section"
  );
  if (roadmapContainer) {
    // 1. THE DATA for the roadmap
    // 1. THE DATA for the new 12-class roadmap
    const roadmapData = [
      // Class 1
      {
        id: "class-1",
        type: "class",
        title: "Class 1",
        gridRow: 1,
        content:
          "<h4>Focus: Digital Introduction</h4><p>A gentle start with computer basics, mouse skills, and digital world terminology.</p>",
      },
      {
        id: "skill-1-1",
        parentId: "class-1",
        type: "skill",
        position: "left",
        title: "Using a Computer",
        gridRow: 1,
        content:
          "<p>Learning the parts of a computer, how to use a mouse and keyboard, and basic navigation.</p>",
      },

      // Class 2
      {
        id: "class-2",
        type: "class",
        title: "Class 2",
        gridRow: 2,
        content:
          "<h4>Focus: Creative Tools</h4><p>Exploring creativity with simple drawing and animation tools to build confidence with digital interfaces.</p>",
      },
      {
        id: "skill-2-1",
        parentId: "class-2",
        type: "skill",
        position: "right",
        title: "Digital Painting",
        gridRow: 2,
        content:
          "<p>Using tools like Tux Paint to understand colors, shapes, and digital art creation.</p>",
      },

      // Class 3
      {
        id: "class-3",
        type: "class",
        title: "Class 3",
        gridRow: 3,
        content:
          "<h4>Focus: Logic Blocks</h4><p>Introduction to the fundamental concepts of programming logic using visual, block-based environments.</p>",
      },
      {
        id: "skill-3-1",
        parentId: "class-3",
        type: "skill",
        position: "left",
        title: "Sequencing & Loops",
        gridRow: 3,
        content:
          "<p>Understanding that instructions run in order and learning how to repeat actions using loops in ScratchJr.</p>",
      },

      // Class 4
      {
        id: "class-4",
        type: "class",
        title: "Class 4",
        gridRow: 4,
        content:
          "<h4>Focus: Scratch Basics</h4><p>Building simple animations, stories, and games using Scratch to apply logical concepts.</p>",
      },
      {
        id: "skill-4-1",
        parentId: "class-4",
        type: "skill",
        position: "right",
        title: "Events & Conditionals",
        gridRow: 4,
        content:
          "<p>Learning about event-driven programming (e.g., 'when green flag clicked') and making decisions with 'if-then' blocks.</p>",
      },

      // Class 5
      {
        id: "class-5",
        type: "class",
        title: "Class 5",
        gridRow: 5,
        content:
          "<h4>Focus: App Prototyping</h4><p>Designing the look, feel, and user flow of mobile applications and simple websites.</p>",
      },
      {
        id: "skill-5-1",
        parentId: "class-5",
        type: "skill",
        position: "left",
        title: "UI/UX Fundamentals",
        gridRow: 5,
        content:
          "<p>Understanding the basics of User Interface and User Experience design to create intuitive apps.</p>",
      },

      // Class 6
      {
        id: "class-6",
        type: "class",
        title: "Class 6",
        gridRow: 6,
        content:
          "<h4>Focus: Introduction to Python</h4><p>Making the leap from block-based to text-based programming with a powerful, beginner-friendly language.</p>",
      },
      {
        id: "skill-6-1",
        parentId: "class-6",
        type: "skill",
        position: "right",
        title: "Variables & Data Types",
        gridRow: 6,
        content:
          "<p>Learning to store and manipulate information like numbers, strings, and lists in Python.</p>",
      },

      // Class 7
      {
        id: "class-7",
        type: "class",
        title: "Class 7",
        gridRow: 7,
        content:
          "<h4>Focus: Web Development</h4><p>Learning the fundamental building blocks of the internet: HTML for structure and CSS for styling.</p>",
      },
      {
        id: "skill-7-1",
        parentId: "class-7",
        type: "skill",
        position: "left",
        title: "HTML & CSS Basics",
        gridRow: 7,
        content:
          "<p>Creating a first personal webpage, learning about tags, elements, selectors, and properties.</p>",
      },

      // Class 8
      {
        id: "class-8",
        type: "class",
        title: "Class 8",
        gridRow: 8,
        content:
          "<h4>Focus: Cyber Safety</h4><p>Becoming a responsible and safe digital citizen by understanding online risks and best practices.</p>",
      },
      {
        id: "skill-8-1",
        parentId: "class-8",
        type: "skill",
        position: "right",
        title: "Digital Footprint",
        gridRow: 8,
        content:
          "<p>Understanding how information is shared online and the importance of privacy settings and strong passwords.</p>",
      },

      // Class 9
      {
        id: "class-9",
        type: "class",
        title: "Class 9",
        gridRow: 9,
        content:
          "<h4>Focus: Advanced Python</h4><p>Exploring more complex programming concepts like data structures, algorithms, and functions.</p>",
      },
      {
        id: "skill-9-1",
        parentId: "class-9",
        type: "skill",
        position: "left",
        title: "Functions & Algorithms",
        gridRow: 9,
        content:
          "<p>Writing reusable blocks of code with functions and learning how to solve problems efficiently with algorithms.</p>",
      },

      // Class 10
      {
        id: "class-10",
        type: "class",
        title: "Class 10",
        gridRow: 10,
        content:
          "<h4>Focus: Introduction to AI</h4><p>Understanding the core concepts of Artificial Intelligence and Machine Learning.</p>",
      },
      {
        id: "skill-10-1",
        parentId: "class-10",
        type: "skill",
        position: "right",
        title: "Machine Learning Models",
        gridRow: 10,
        content:
          "<p>Learning the difference between supervised, unsupervised, and reinforcement learning through simple examples.</p>",
      },

      // Class 11
      {
        id: "class-11",
        type: "class",
        title: "Class 11",
        gridRow: 11,
        content:
          "<h4>Focus: Data Science</h4><p>Learning to work with large datasets to find patterns, make predictions, and create visualizations.</p>",
      },
      {
        id: "skill-11-1",
        parentId: "class-11",
        type: "skill",
        position: "left",
        title: "Data Visualization",
        gridRow: 11,
        content:
          "<p>Using libraries like Matplotlib or Plotly to turn raw data into insightful charts and graphs.</p>",
      },

      // Class 12
      {
        id: "class-12",
        type: "class",
        title: "Class 12",
        gridRow: 12,
        content:
          "<h4>Focus: Capstone Project</h4><p>The culmination of the learning journey where students build a major project from start to finish.</p>",
      },
      {
        id: "skill-12-1",
        parentId: "class-12",
        type: "skill",
        position: "right",
        title: "Project Development",
        gridRow: 12,
        content:
          "<p>Applying skills in planning, coding, testing, and deployment to create a portfolio-worthy application or analysis.</p>",
      },
    ];

    const nodesContainer = document.getElementById("roadmap-nodes");
    const linesContainer = document.getElementById("roadmap-lines");

    // 2. RENDER THE NODES (BOXES)
    function renderNodes() {
      roadmapData.forEach((node, index) => {
        const nodeEl = document.createElement("div");
        nodeEl.classList.add("roadmap-node", `node-${node.type}`);
        if (node.position) {
          nodeEl.classList.add(`pos-${node.position}`);
        }
        nodeEl.innerText = node.title;
        nodeEl.dataset.id = node.id;
        nodeEl.style.gridRow = node.gridRow;
        nodeEl.style.animationDelay = `${index * 100}ms`;
        nodesContainer.appendChild(nodeEl);
      });
    }

    // 3. DRAW THE CONNECTING LINES
    function drawLines() {
      // Use a timeout to ensure nodes are rendered and positioned by the browser
      setTimeout(() => {
        const isMobile = window.innerWidth <= 767;
        if (isMobile) return; // Don't draw lines on mobile

        linesContainer.innerHTML = ""; // Clear existing lines

        roadmapData.forEach((node) => {
          if (!node.parentId) return;

          const childEl = document.querySelector(`[data-id="${node.id}"]`);
          const parentEl = document.querySelector(
            `[data-id="${node.parentId}"]`
          );

          const parentRect = parentEl.getBoundingClientRect();
          const childRect = childEl.getBoundingClientRect();
          const containerRect = nodesContainer.getBoundingClientRect();

          const startX =
            (node.position === "left" ? parentRect.left : parentRect.right) -
            containerRect.left;
          const startY =
            parentRect.top + parentRect.height / 2 - containerRect.top;

          const endX =
            (node.position === "left" ? childRect.right : childRect.left) -
            containerRect.left;
          const endY = childRect.top + childRect.height / 2 - containerRect.top;

          const controlX1 = startX + (endX - startX) * 0.5;
          const controlY1 = startY;
          const controlX2 = startX + (endX - startX) * 0.5;
          const controlY2 = endY;

          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute(
            "d",
            `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
          );
          path.classList.add(
            node.id.startsWith("skill-") ? "line-dotted" : "line-solid"
          );
          linesContainer.appendChild(path);
        });
      }, 200); // Delay to allow layout to settle
    }

    // 4. HANDLE POPUP (MODAL) INTERACTIVITY
    const modal = document.getElementById("roadmap-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    nodesContainer.addEventListener("click", (e) => {
      const nodeEl = e.target.closest(".roadmap-node");
      if (nodeEl) {
        const nodeId = nodeEl.dataset.id;
        const nodeData = roadmapData.find((n) => n.id === nodeId);
        if (nodeData) {
          modalTitle.innerText = nodeData.title;
          modalBody.innerHTML = nodeData.content;
          modal.classList.add("is-visible");
        }
      }
    });

    function closeModal() {
      modal.classList.remove("is-visible");
    }
    document
      .getElementById("modal-close-btn")
      .addEventListener("click", closeModal);
    document
      .getElementById("modal-backdrop")
      .addEventListener("click", closeModal);

    // --- INITIALIZE THE ROADMAP ---
    renderNodes();
    drawLines();

    // Redraw lines on window resize (for responsiveness)
    window.addEventListener("resize", drawLines);
  }
});
