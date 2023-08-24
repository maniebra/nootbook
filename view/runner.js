function runCode() {
  // Get all buttons with the class 'run-button'
  const runButtons = document.querySelectorAll(".run-button");

  // Add a click listener to each button
  runButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const grandparent = button.parentElement.parentElement;
      const inputArea = button.parentElement.querySelector("textarea");
      const codeTag = grandparent.querySelector("code");
      if (codeTag) {
        lang = codeTag.className;
        code = codeTag.textContent;
        input = inputArea.value;
        jsonData = { run: { language: lang, code: code, input: input } };
        const res = serverRunCode(
          JSON.stringify({ code: jsonData }),
          grandparent
        );
        runCode();
        console.log(res);
      } else {
        console.log("No <code> tag found in the grandparent element.");
      }
    });
  });
}

async function serverRunCode(code, block) {
  const response = await fetch("/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: code,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  // Assuming `data` is a string containing HTML content
  if (block.innerHTML.includes('<div class="output">')) {
    block.innerHTML = block.innerHTML.replace(
      /<div class="output">.*?<\/div>/g,
      `<div class="output"><p class="output-title">Output: </p><code class="stdout">${data.message}</code></div>`
    );
  } else {
    block.innerHTML += `<div class="output"><p class="output-title">Output: </p><code class="stdout">${data.message.replace(
      "\n",
      "<br>"
    )}</code></div>`;
  }
  block.style.height = "auto";
  block.style.height = `${block.scrollHeight}px`;

  return;
}

function fixInputAreas() {
  const inputarea = document.getElementsByClassName("input-area");
  if (inputarea.length > 0) {
    inputarea.forEach((element) => {
      element.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = `${this.scrollHeight}px`;
      });
    });
  }
}
