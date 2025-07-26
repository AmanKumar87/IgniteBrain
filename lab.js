document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("lab-page-container")) {
    // --- DOM ELEMENT SELECTORS ---
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

    // --- STATE MANAGEMENT ---
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
    };

    // --- INITIALIZATION ---
    function initializeLab() {
      updateFileExplorer();
      createEditors();
      setActiveFile(projectFiles[currentLanguage][0]);
      updateEditorVisibility();
    }

    // --- UI UPDATE FUNCTIONS ---
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

      consoleContainer.classList.toggle("hidden", currentLanguage === "web");
      setActiveFile(projectFiles[currentLanguage][0]);
    }

    // --- PYTHON EXECUTION LOGIC (CORRECTED & OPTIMIZED) ---
    function builtinRead(x) {
      if (
        Sk.builtinFiles === undefined ||
        Sk.builtinFiles["files"][x] === undefined
      )
        throw new Error("File not found: '" + x + "'");
      return Sk.builtinFiles["files"][x];
    }

    function runPython(code) {
      outputConsole.innerHTML =
        '<span class="prompt">> Running main.py...</span>\n';
      Sk.configure({
        output: (text) => {
          const outputNode = document.createTextNode(text);
          outputConsole.appendChild(outputNode);
        },
        read: builtinRead,
        __future__: Sk.python3,
        execLimit: 5000, // Execution time limit: 5 seconds
      });

      const executionPromise = Sk.misceval.asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, code, true);
      });

      executionPromise.then(
        (mod) => {
          outputConsole.innerHTML +=
            '\n<span class="prompt">> Process finished successfully.</span>';
        },
        (err) => {
          const errorNode = document.createElement("span");
          errorNode.className = "error";
          errorNode.textContent = `\n${err.toString()}`;
          outputConsole.appendChild(errorNode);
        }
      );
    }

    // --- EVENT LISTENERS ---
    languageTabs.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const lang = e.target.dataset.lang;
        if (lang === currentLanguage) return;
        currentLanguage = lang;

        languageTabs.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");

        updateFileExplorer();
        updateEditorVisibility();
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
      updateEditorVisibility();
      createSingleEditor(fileName);
      setActiveFile(fileName);
    });

    runCodeBtn.addEventListener("click", () => {
      if (currentLanguage === "web") {
        const htmlCode = editors["index.html"]?.getValue() || "";
        const cssCode = `<style>${
          editors["style.css"]?.getValue() || ""
        }</style>`;
        const jsCode = `<script>${
          editors["script.js"]?.getValue() || ""
        }<\/script>`;
        const combinedCode = `<html><head><title>Ignite Brain Preview</title>${cssCode}</head><body>${htmlCode}${jsCode}</body></html>`;

        const newTab = window.open();
        newTab.document.open();
        newTab.document.write(combinedCode);
        newTab.document.close();
      } else if (currentLanguage === "python") {
        const pythonCode = editors[activeFile]?.getValue() || "";
        runPython(pythonCode);
      } else {
        const langName = languageTabs.querySelector(".active").textContent;
        outputConsole.innerHTML = `<span class="prompt">> Simulating output for ${langName}...</span>\n\nHello, Ignite Brain!\n\n<span class="prompt">> Process finished successfully.</span>`;
      }
    });

    // --- Resizer Logic ---
    let isResizing = false;
    resizer.addEventListener("mousedown", () => {
      isResizing = true;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener(
        "mouseup",
        () => {
          isResizing = false;
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
    }

    // --- RUN INITIALIZATION ---
    initializeLab();
  }
});
