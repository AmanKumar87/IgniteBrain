document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("lab-page-container")) {
    // --- HELPER FUNCTION ---
    function debounce(func, delay = 250) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    } // --- DOM ELEMENT SELECTORS ---

    const labContainer = document.getElementById("lab-page-container");
    const editorAndPreviewContainer = document.getElementById(
      "editor-and-preview-container"
    );
    const languageTabs = document.getElementById("language-tabs");
    const runCodeBtn = document.getElementById("run-code-btn");
    const newFileBtn = document.getElementById("new-file-btn");
    const fileList = document.getElementById("file-list");
    const editorTabsContainer = document.getElementById("editor-tabs");
    const editorContainer = document.getElementById("editor-container");
    const consoleContainer = document.getElementById("console-container");
    const outputConsole = document.getElementById("output-console");
    const resizer = document.getElementById("resizer");
    const fileExplorer = document.getElementById("file-explorer");
    const topPane = document.getElementById("top-pane");
    const previewPane = document.getElementById("preview-pane");
    const previewFrame = document.getElementById("live-preview-iframe"); // --- STATE MANAGEMENT ---

    let currentLanguage = "web";
    let editors = {};
    let activeFile = "";

    const projectFiles = {
      web: ["index.html", "style.css", "script.js"],
      python: ["main.py"],
      cpp: ["main.cpp"],
      c: ["main.c"],
      java: ["Main.java"],
    };

    const fileModes = {
      "index.html": "xml",
      "style.css": "css",
      "script.js": "javascript",
      "main.py": "python",
      "main.cpp": "text/x-c++src",
      "main.c": "text/x-csrc",
      "Main.java": "text/x-java",
    };

    const allowedExtensions = {
      web: [".html", ".css", ".js"],
      python: [".py"],
      cpp: [".cpp", ".h"],
      c: [".c", ".h"],
      java: [".java"],
    }; // --- LIVE PREVIEW LOGIC ---

    const debouncedUpdate = debounce(() => updateWebPreview(), 500);

    function updateWebPreview() {
      if (currentLanguage !== "web") return;

      const htmlCode = editors["index.html"]?.getValue() || "";
      const cssCode = `<style>${
        editors["style.css"]?.getValue() || ""
      }</style>`;
      const jsCode = `<script>${
        editors["script.js"]?.getValue() || ""
      }<\/script>`;

      const combinedCode = `
        <html>
          <head>
            <title>Ignite Brain Preview</title>
            ${cssCode}
          </head>
          <body>
            ${htmlCode}
            ${jsCode}
          </body>
        </html>`;

      previewFrame.srcdoc = combinedCode;
    } // --- PYTHON EXECUTION LOGIC ---

    function builtinRead(x) {
      if (
        Sk.builtinFiles === undefined ||
        Sk.builtinFiles["files"][x] === undefined
      )
        throw new Error("File not found: '" + x + "'");
      return Sk.builtinFiles["files"][x];
    }

    function runPython(code) {
      // 1. Clear the console completely
      outputConsole.innerHTML = ""; // 2. Add the "Running..." message as a new element

      const runningMsg = document.createElement("span");
      runningMsg.className = "prompt";
      runningMsg.textContent = "> Running main.py...\n";
      outputConsole.appendChild(runningMsg); // 3. Configure Skulpt to append any output it generates

      Sk.configure({
        output: (text) => {
          const outputNode = document.createTextNode(text);
          outputConsole.appendChild(outputNode);
        },
        read: builtinRead,
        __future__: Sk.python3,
        execLimit: 5000,
      });

      const executionPromise = Sk.misceval.asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, code, true);
      });

      executionPromise.then(
        (mod) => {
          // 4. On success, append the "finished" message
          const finishedMsg = document.createElement("span");
          finishedMsg.className = "prompt";
          finishedMsg.textContent = "\n> Process finished successfully.";
          outputConsole.appendChild(finishedMsg);
        },
        (err) => {
          // 5. On error, append the error message
          const errorNode = document.createElement("span");
          errorNode.className = "error";
          errorNode.textContent = `\n${err.toString()}`;
          outputConsole.appendChild(errorNode);
        }
      );
    }

    function initializeLab() {
      updateFileExplorer();
      createEditors();
      setActiveFile(projectFiles[currentLanguage][0]);
      updateEditorVisibility();
      updatePaneVisibility(); // Initial pane setup
    }

    function updateFileExplorer() {
      fileList.innerHTML = "";
      projectFiles[currentLanguage].forEach((file) => {
        const fileEl = document.createElement("div");
        fileEl.className = "file-item";
        fileEl.textContent = file;
        fileEl.dataset.file = file;
        fileList.appendChild(fileEl);
      });
    }

    function createEditors() {
      editorContainer.innerHTML = "";
      editors = {};
      Object.values(projectFiles)
        .flat()
        .forEach((file) => {
          if (!editors[file]) createSingleEditor(file);
        });
    }

    function createSingleEditor(fileName) {
      const editorWrapper = document.createElement("div");
      editorWrapper.className = "editor-instance hidden";
      editorWrapper.dataset.file = fileName;
      const textarea = document.createElement("textarea");
      editorWrapper.appendChild(textarea);
      editorContainer.appendChild(editorWrapper);

      editors[fileName] = CodeMirror.fromTextArea(textarea, {
        mode: fileModes[fileName],
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
      });

      if (allowedExtensions.web.some((ext) => fileName.endsWith(ext))) {
        editors[fileName].on("change", debouncedUpdate);
      }
    }

    function setActiveFile(fileName) {
      activeFile = fileName;
      document
        .querySelectorAll(".file-item")
        .forEach((el) =>
          el.classList.toggle("active", el.dataset.file === fileName)
        );
      document
        .querySelectorAll(".editor-tab")
        .forEach((el) =>
          el.classList.toggle("active", el.dataset.file === fileName)
        );
      document
        .querySelectorAll(".editor-instance")
        .forEach((el) =>
          el.classList.toggle("hidden", el.dataset.file !== fileName)
        );
      setTimeout(() => editors[fileName]?.refresh(), 1);
    }

    function updateEditorVisibility() {
      editorTabsContainer.innerHTML = "";
      projectFiles[currentLanguage].forEach((file) => {
        const tab = document.createElement("button");
        tab.className = "editor-tab";
        tab.textContent = file;
        tab.dataset.file = file;
        editorTabsContainer.appendChild(tab);
      });
      setActiveFile(projectFiles[currentLanguage][0]);
    }

    // THIS IS THE UPDATED FUNCTION
    function updatePaneVisibility() {
      const isWeb = currentLanguage === "web";

      // Dynamically change layout direction
      if (isWeb) {
        // For Web: use a side-by-side vertical split
        editorAndPreviewContainer.classList.remove("flex-col");
        editorAndPreviewContainer.classList.add("flex-row");
      } else {
        // For other languages: use a top-and-bottom horizontal split
        editorAndPreviewContainer.classList.remove("flex-row");
        editorAndPreviewContainer.classList.add("flex-col");
      }

      // Show/hide the correct output pane
      previewPane.classList.toggle("hidden", !isWeb);
      consoleContainer.classList.toggle("hidden", isWeb);

      if (isWeb) {
        updateWebPreview();
      }
    } // --- EVENT LISTENERS ---

    languageTabs.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const lang = e.target.dataset.lang;
        if (lang === currentLanguage) return;
        currentLanguage = lang;

        languageTabs.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");

        updateFileExplorer();
        updateEditorVisibility();
        updatePaneVisibility();
      }
    });

    fileList.addEventListener("click", (e) => {
      if (e.target.classList.contains("file-item"))
        setActiveFile(e.target.dataset.file);
    });

    editorTabsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("editor-tab"))
        setActiveFile(e.target.dataset.file);
    });

    newFileBtn.addEventListener("click", () => {
      const extensions = allowedExtensions[currentLanguage].join(", ");
      const fileName = prompt(
        `Enter new filename (extensions: ${extensions}):`
      );

      if (!fileName) return;

      const validExtension = allowedExtensions[currentLanguage].some((ext) =>
        fileName.endsWith(ext)
      );
      if (!validExtension) {
        alert(
          `Invalid file extension. Please use one of the following: ${extensions}`
        );
        return;
      }

      if (projectFiles[currentLanguage].includes(fileName)) {
        alert(`File "${fileName}" already exists.`);
        return;
      }

      projectFiles[currentLanguage].push(fileName);
      const extension = "." + fileName.split(".").pop();
      const modeKey = Object.keys(fileModes).find((key) =>
        key.endsWith(extension)
      );
      fileModes[fileName] = modeKey ? fileModes[modeKey] : "text/plain";

      updateFileExplorer();
      createSingleEditor(fileName);
      updateEditorVisibility();
      setActiveFile(fileName);
    });

    runCodeBtn.addEventListener("click", () => {
      if (currentLanguage === "web") {
        updateWebPreview();
      } else if (currentLanguage === "python") {
        const pythonCode = editors[activeFile]?.getValue() || "";
        runPython(pythonCode);
      } else {
        const langName = languageTabs.querySelector(".active").textContent;
        outputConsole.innerHTML = `<span class="prompt">> Simulating output for ${langName}...</span>\n\nHello, Ignite Brain!\n\n<span class="prompt">> Process finished successfully.</span>`;
      }
    }); // --- Resizer Logic ---

    let isResizing = false;
    resizer.addEventListener("mousedown", () => {
      isResizing = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener(
        "mouseup",
        () => {
          isResizing = false;
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
          document.removeEventListener("mousemove", handleMouseMove);
        },
        { once: true }
      );
    });

    function handleMouseMove(e) {
      if (!isResizing) return;
      const containerRect = labContainer.getBoundingClientRect();
      const newExplorerWidth = e.clientX - containerRect.left;

      if (
        newExplorerWidth > 150 &&
        newExplorerWidth < containerRect.width - 400
      ) {
        fileExplorer.style.width = `${newExplorerWidth}px`;
      }
    } // --- RUN INITIALIZATION ---

    initializeLab();
  }
});
