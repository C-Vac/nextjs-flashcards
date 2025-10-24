const { spawn } = require("child_process");

class OllamaClient {
  async generate(prompt, model = "qwen2.5-coder:3b") {
    return new Promise((resolve, reject) => {
      const ollama = spawn("ollama", ["run", model, prompt]);
      let output = "";
      let errorOutput = "";

      ollama.stdout.on("data", (data) => {
        output += data.toString();
      });

      ollama.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      ollama.on("close", (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Ollama failed: ${errorOutput}`));
        }
      });
    });
  }
}

module.exports = new OllamaClient();
