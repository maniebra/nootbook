const textarea = document.getElementById("markdown");

textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = `${this.scrollHeight}px`; // Set
  fixInputAreas();
  runCode();
});

textarea.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault(); // Prevent the default tab behavior
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert a tab character at the current cursor position
    const tab = "\t";
    textarea.value =
      textarea.value.substring(0, start) + tab + textarea.value.substring(end);

    // Set the cursor position after the inserted tab
    textarea.selectionStart = textarea.selectionEnd = start + tab.length;
  }
});
