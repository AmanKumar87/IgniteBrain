(() => {
  const initialize = () => {
    const labContainer = document.getElementById("lab-page-container");
    if (!labContainer) return;

    // --- DOM ELEMENT SELECTIONS ---
    const languageTabs = document.getElementById("language-tabs");
    const runCodeBtn = document.getElementById("run-code-btn");
    const fileList = document.getElementById("file-list");
    const editorTabsContainer = document.getElementById("editor-tabs");
    const editorContainer = document.getElementById("editor-container");
    const fileExplorer = document.getElementById("file-explorer");
    const resizer = document.getElementById("resizer");
    const newFileBtn = document.getElementById("new-file-btn");

    // View Containers
    const splitViewContainer = document.getElementById("split-view-container");
    const onecompilerContainer = document.getElementById(
      "onecompiler-container"
    );

    // Output Wrappers (inside split view)
    const previewWrapper = document.getElementById("preview-wrapper");
    const previewFrame = document.getElementById("live-preview-iframe");

    // --- STATE & CONFIG ---
    let currentLanguage = "web";
    let editors = {};

    // MODIFICATION 1: Add "web" to the list of OneCompiler languages.
    const oneCompilerLanguages = {
      web: "html", // Change "web" to "html"
      python: "python",
      cpp: "cpp",
      c: "c",
      java: "java",
    };

    // MODIFICATION 2: Empty the project files list for "web".
    const projectFiles = {
      web: [], // Was ["index.html", "style.css", "script.js"]
      python: [],
      cpp: [],
      c: [],
      java: [],
    };

    const fileModes = {
      "index.html": "xml",
      "style.css": "css",
      "script.js": "javascript",
    };

    // --- HELPER FUNCTION ---
    const getModeForFile = (fileName) => {
      if (fileName.endsWith(".css")) return "css";
      if (fileName.endsWith(".js")) return "javascript";
      if (fileName.endsWith(".html")) return "xml";
      return "plaintext";
    };

    // --- UI FUNCTIONS ---
    const updateFileExplorer = () => {
      fileList.innerHTML = "";
      projectFiles[currentLanguage].forEach((file) => {
        const fileEl = document.createElement("div");
        fileEl.className = "file-item";
        fileEl.textContent = file;
        fileEl.dataset.file = file;
        fileList.appendChild(fileEl);
      });
      updateActiveFileStyles();
    };

    const updateEditorTabs = () => {
      editorTabsContainer.innerHTML = "";
      projectFiles[currentLanguage].forEach((file) => {
        const tab = document.createElement("button");
        tab.className = "editor-tab";
        tab.textContent = file;
        tab.dataset.file = file;
        editorTabsContainer.appendChild(tab);
      });
      updateActiveFileStyles();
    };

    const setActiveFile = (fileName) => {
      if (!fileName) return;
      updateActiveFileStyles(fileName);
      setTimeout(() => editors[fileName]?.refresh(), 1);
    };

    const updateActiveFileStyles = (activeFile) => {
      document
        .querySelectorAll(".file-item")
        .forEach((el) =>
          el.classList.toggle("active", el.dataset.file === activeFile)
        );
      document
        .querySelectorAll(".editor-tab")
        .forEach((el) =>
          el.classList.toggle("active", el.dataset.file === activeFile)
        );
      Object.entries(editors).forEach(([name, editor]) => {
        editor
          .getWrapperElement()
          .classList.toggle("hidden", name !== activeFile);
      });
    };

    const updatePaneVisibility = () => {
      const isOneCompilerLang =
        oneCompilerLanguages.hasOwnProperty(currentLanguage);

      // This logic now automatically handles the "web" tab correctly.
      splitViewContainer.classList.toggle("hidden", isOneCompilerLang);
      fileExplorer.classList.toggle("hidden", isOneCompilerLang);
      resizer.classList.toggle("hidden", isOneCompilerLang);
      onecompilerContainer.classList.toggle("hidden", !isOneCompilerLang);
      runCodeBtn.style.display = isOneCompilerLang ? "none" : "inline-flex";

      if (isOneCompilerLang) {
        const lang = oneCompilerLanguages[currentLanguage];
        onecompilerContainer.innerHTML = `<iframe
          frameBorder="0"
          width="100%"
          height="100%"
          src="https://onecompiler.com/embed/${lang}?hideTitle=true&theme=dark"
        ></iframe>`;
      } else {
        onecompilerContainer.innerHTML = "";
        previewWrapper.classList.remove("hidden");
        document.getElementById("console-wrapper").classList.add("hidden");
        updateWebPreview();
        setTimeout(() => {
          Object.values(editors).forEach((editor) => editor.refresh());
        }, 1);
      }
    };

    const createEditorInstance = (fileName) => {
      if (editors[fileName]) return;
      const editorWrapper = document.createElement("div");
      editorWrapper.className = "editor-instance";
      editorContainer.appendChild(editorWrapper);
      const cm = CodeMirror(editorWrapper, {
        mode: fileModes[fileName] || getModeForFile(fileName),
        theme: "dracula",
        lineNumbers: true,
      });
      editors[fileName] = cm;
      cm.on("change", debounce(updateWebPreview, 400));
    };

    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    };

    const updateWebPreview = () => {
      const htmlCode = editors["index.html"]?.getValue() || "";
      const cssCode = editors["style.css"]?.getValue() || "";
      const jsCode = editors["script.js"]?.getValue() || "";

      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}<\/script>
        </body>
        </html>
      `;
      previewFrame.srcdoc = fullHtml;
    };

    // --- EVENT LISTENERS ---
    const setupEventListeners = () => {
      languageTabs.addEventListener("click", (e) => {
        if (
          e.target.tagName !== "BUTTON" ||
          e.target.dataset.lang === currentLanguage
        )
          return;

        currentLanguage = e.target.dataset.lang;
        languageTabs.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");

        updateFileExplorer();
        updateEditorTabs();
        setActiveFile(projectFiles[currentLanguage][0]);
        updatePaneVisibility();
      });

      fileList.addEventListener("click", (e) => {
        if (e.target.classList.contains("file-item"))
          setActiveFile(e.target.dataset.file);
      });

      editorTabsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("editor-tab"))
          setActiveFile(e.target.dataset.file);
      });

      runCodeBtn.addEventListener("click", () => {
        if (currentLanguage === "web") {
          updateWebPreview();
        }
      });

      newFileBtn.addEventListener("click", () => {
        if (oneCompilerLanguages.hasOwnProperty(currentLanguage)) {
          alert("File creation is not supported for this compiler.");
          return;
        }

        const newFileName = prompt(
          "Enter new file name (e.g., about.html, main.css):"
        );
        if (!newFileName || newFileName.trim() === "") return;

        if (projectFiles.web.includes(newFileName)) {
          alert("A file with this name already exists.");
          return;
        }

        projectFiles.web.push(newFileName);
        fileModes[newFileName] = getModeForFile(newFileName);

        updateFileExplorer();
        updateEditorTabs();
        createEditorInstance(newFileName);
        setActiveFile(newFileName);
      });
    };

    // --- INITIALIZATION ---
    const start = () => {
      projectFiles.web.forEach(createEditorInstance);

      updateFileExplorer();
      updateEditorTabs();
      setActiveFile(projectFiles[currentLanguage][0]);
      updatePaneVisibility();
      setupEventListeners();
    };
    start();
  };
  document.addEventListener("DOMContentLoaded", initialize);
})();
