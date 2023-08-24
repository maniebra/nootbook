const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const port = 8080; // You can change this to the port you want to use

app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // Use path.join to ensure correct file path across different operating systems
  const filePath = path.join(__dirname, "..", "view", "test.html");
  res.sendFile(filePath);
});

app.get("/prism.css", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "prism", "prism.css");
  res.setHeader("Content-Type", "text/css");
  res.sendFile(filePath);
});

app.get("/prism.js", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "prism", "prism.js");
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(filePath);
});

app.get("/styles.css", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "styles.css");
  res.setHeader("Content-Type", "text/css");
  res.sendFile(filePath);
});

app.get("/mathjax/tex-mml-chtml.js", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "mathjax", "core.js");
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(filePath);
});

app.get("/renderer.js", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "renderer.js");
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(filePath);
});

app.get("/utils.js", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "utils.js");
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(filePath);
});

app.get("/runner.js", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "runner.js");
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(filePath);
});

app.get("/ui.js", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "ui.js");
  res.setHeader("Content-Type", "text/javascript");
  res.sendFile(filePath);
});

app.get("/favicon.svg", (req, res) => {
  const filePath = path.join(__dirname, "..", "view", "favicon.svg");
  res.sendFile(filePath);
});

app.get("/fonts/Poppins/Poppins-Medium.ttf", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "view",
    "fonts",
    "Poppins",
    "Poppins-Medium.ttf"
  );
  res.sendFile(filePath);
});

app.post("/save", (req, res) => {
  const markdown = req.body.md;
  let title = req.body.title;
  if (title === "") {
    title = "untitled";
  }
  const fs = require("fs");
  fs.writeFileSync(`${title}.nootnoot`, markdown);
  res.sendFile(path.join(__dirname, "..", `${title}.nootnoot`));
});

app.post("/run", (req, res) => {
  const data = req.body.code;
  const language = data.run.language.replace("language-", "");
  const input = data.run.input;
  const code = data.run.code;

  if (language == "cpp" || language == "c") {
    const cppFilePath = `temp.${language}`;
    const fs = require("fs");
    fs.writeFileSync(cppFilePath, code);

    // Compile and execute the C++ code using GCC
    const outputPath = "output.exe";
    const compileCommand = `g++ ${cppFilePath} -o ${outputPath}`;
    const executeCommand = `echo ${input} | ${outputPath}`;
    let output = "ERROR!";

    exec(compileCommand, (compileError) => {
      if (compileError) {
        output = ("Compilation error:", compileError);
        res.json({ message: output });
        return;
      }

      exec(executeCommand, (runError, stdout, stderr) => {
        if (runError) {
          output = ("Runtime error:", runError);
          res.json({ message: output });
          return;
        }
        output = stdout;
        console.log("Program output:\n", stdout);
        res.json({ message: output });
        fs.unlink(outputPath, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          } else {
            console.log("File deleted successfully.");
          }
        });
        fs.unlink(cppFilePath, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          } else {
            console.log("File deleted successfully.");
          }
        });
      });
    });
  } else if (language == "python") {
    const pythonFilePath = "temp.py";
    const fs = require("fs");
    fs.writeFileSync(pythonFilePath, code);

    const executeCommand = `python ${pythonFilePath}`;
    const childProcess = exec(executeCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Error:", error);
        res.json({ message: error });
        return;
      }
      console.log("Program output:\n", stdout);
      res.json({ message: stdout });
    });

    // Pass input to the Python code via stdin
    childProcess.stdin.write(`${input}\n`);
    childProcess.stdin.end();
  } else {
    console.log(data);
    res.json({ message: "wtf?" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
