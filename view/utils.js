async function save() {
  data = document.getElementById("markdown").value;
  title = document.getElementById("notebook-title").value;
  fetch("/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ md: data, title: title }),
  })
    .then((response) => response.blob())
    .then((blobData) => {
      // Create a Blob URL for the file data
      const blobUrl = URL.createObjectURL(blobData);
      if (title === "") {
        title = "untitled";
      }
      // Create an invisible <a> element
      const downloadLink = document.createElement("a");
      downloadLink.style.display = "none";
      downloadLink.href = blobUrl;
      downloadLink.download = `${title}.nootnoot`; // Specify the desired filename

      // Append the <a> element to the document and trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up by removing the <a> element and revoking the Blob URL
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error("Error fetching the file:", error);
    });
}

function load() {
  const fileInput = document.getElementById("fileInput");
  fileInput.click();
  fileInput.addEventListener("change", function (event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const content = event.target.result;
        const name = event.target.name;
        document.getElementById("notebook-title").value = name;
        document.getElementById("markdown").value = content;
        renderAll();
        document.getElementById("markdown").style.height = "auto";
        document.getElementById("markdown").style.height = `${
          document.getElementById("markdown").scrollHeight
        }px`;
      };

      reader.readAsText(selectedFile);
    }
  });
}
function editorOnly() {
  document.getElementById("editor").style.width = "98%";
  document.getElementById("preview").style.display = "none";
  document.getElementById("editor").style.display = "block";
}
function editorPreview() {
  document.getElementById("editor").style.width = "48%";
  document.getElementById("preview").style.width = "48%";
  document.getElementById("preview").style.display = "block";
  document.getElementById("editor").style.display = "block";
}
function previewOnly() {
  document.getElementById("preview").style.width = "98%";
  document.getElementById("editor").style.display = "none";
  document.getElementById("preview").style.display = "block";
}
function runAll() {
  const codeElements = document.getElementsByTagName("code");
  const resultDiv = document.getElementById("run-all-codes").parentElement;
  const inputArea = document.getElementById("all-code-input");
  let codeBody = "";
  let codeLang = "";
  for (let i = 0; i < codeElements.length; i++) {
    if (!codeElements[i].className.includes("language-none")) {
      if (codeLang == "") {
        codeLang = codeElements[i].className.replace("language-", "");
      }
      codeBody += codeElements[i].innerText + "\n";
    }
  }
  jsonData = {
    run: {
      language: codeLang,
      code: codeBody,
      input: inputArea.value,
    },
  };
  const res = serverRunCode(JSON.stringify({ code: jsonData }), resultDiv);
}
