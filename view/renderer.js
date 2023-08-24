function renderMarkdown(text, runEachCell) {
  runCodeSnippet = `<div class="run-code"><textarea placeholder="input..." class="input-area" id="code-input"></textarea><button class="run-button">Run</button></div>`;

  runAllCodes = `<div id="run-all-codes"><textarea placeholder="input..." class="input-area" id="all-code-input"></textarea><button id="run-button" onclick="runAll()">Run</button></div>`;

  text = text.toString();
  text += "\n";
  text = text.replace("<", "&lt;");
  while (text.includes("\\\\")) {
    text = text.replace("\\\\", "<br>");
  }
  // Convert markdown syntax to corresponding HTML
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italics
  if (runEachCell) {
    text = text.replace(
      /```(.*?)\n([\s\S]*?)```/gs,
      '<div class="code-snippet"><pre><code class="language-$1">$2</code></pre>' +
        runCodeSnippet +
        "</div>"
    ); // Code Block
  } else {
    text = text.replace(
      /```(.*?)\n([\s\S]*?)```/gs,
      '<pre><code class="language-$1">$2</code></pre>'
    ); // Code Block
  }
  text = text.replace(/`(.*?)`/g, "<code>$1</code>"); // Inline Code
  text = text.replace(/### (.*?)\n/g, "<h3>$1</h3>"); // SubSubtitle
  text = text.replace(/## (.*?)\n/g, "<h2>$1</h2>"); // Subtitle
  text = text.replace(/# (.*?)\n/g, "<h1>$1</h1>"); // Title

  text = text.replace(/^> (.+)/gm, "<blockquote>$1</blockquote>"); // Blockquote
  text = text.replace(/^- (.+)/gm, "<ul><li>$1</li></ul>"); // Unordered List

  // Replace '<' with '&lt;' to prevent HTML tag recognition

  // Render equations $$S$$ as <div class="equation">S</div>
  text = text.replace(
    /\$\$\s?(.*)\s?\$\$/g,
    '<div class="equation">\\[$1\\]</div>'
  );
  text = text.replace(
    /\$(.*?)\$/g,
    '<div class="inline-equation">\\($1\\)</div>'
  );

  text = text.replace(/-----(-*?)/g, "<hr>");

  text = text.replace(
    /!\[(.*?)\]\((https?:\/\/\S+)\)/g,
    '<div class="image-container"><img src="$2" alt="$1"></div>'
  );
  text = text.replace(
    /\[(.*?)\]\((https?:\/\/\S+)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );

  // ... Add more rules for other markdown elements
  text = text.replace(/((?:^\d+\.\s+.+\n)+)/gm, function (match, p1) {
    const listItems = p1
      .trim()
      .split("\n")
      .map((item) => item.replace(/^\d+\.\s+(.+)/, "<li>$1</li>"))
      .join("");
    return `<ol>${listItems}</ol>\n`;
  });

  text = text.replace(/(\|.*\|\n){2,}/gm, function (match) {
    const rows = match
      .trim()
      .split("\n")
      .map((row) => {
        const cells = row.split("|").filter((cell) => cell.trim() !== "");
        return `<tr>${cells
          .map((cell) => `<td>${cell.trim()}</td>`)
          .join("")}</tr>`;
      })
      .join("");
    return `<table>${rows}</table>`;
  });

  text = text + "\0\n";
  if (!runEachCell) {
    text +=
      `<div id="execute-all"><h4>Run Document:</h4>` + runAllCodes + "</div>";
  }
  return text;
}

let renderButton = document.getElementById("renderButton");

function renderAll() {
  var renderInputForEachCell = false;
  if (document.getElementById("toggleRunButton").innerText != "Run Notebook") {
    renderInputForEachCell = true;
  }
  const renderedDiv = document.getElementById("rendered");
  renderedDiv.innerHTML = renderMarkdown(
    textarea.value,
    renderInputForEachCell
  );
  Prism.highlightAll();
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, renderedDiv]);
}

renderButton.addEventListener("click", () => {
  renderAll();
});

document.getElementById("markdown").addEventListener("input", function () {
  renderAll();
});

document.getElementById("toggleRunButton").addEventListener("click", () => {
  if (document.getElementById("toggleRunButton").innerText == "Run Notebook") {
    document.getElementById("toggleRunButton").innerText = "Run Each Cell";
  } else {
    document.getElementById("toggleRunButton").innerText = "Run Notebook";
  }
  renderAll();
});
