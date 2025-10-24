import ollama from "ollama";

class OllamaClient {
  async generate(prompt, model = "qwen2.5-coder:3b") {
    let pollInterval;

    const startPolling = () => {
      pollInterval = setInterval(async () => {
        try {
          const processes = await ollama.ps();
          console.log("Ollama processes:", JSON.stringify(processes, null, 2));
        } catch (error) {
          console.error("Error polling Ollama processes:", error);
        }
      }, 5000); // Poll every 5 seconds
    };

    const stopPolling = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        console.log("Ollama polling stopped.");
      }
    };

    startPolling(); // Start polling before the chat request

    try {
      console.log(
        `Ollama: Generating with model: ${model}, prompt: ${String(
          prompt
        ).substring(0, 100)}...`
      );
      const response = await ollama.chat({
        model: model,
        messages: [{ role: "user", content: String(prompt) }],
      });
      console.log("Ollama: Chat response received.");
      stopPolling(); // Stop polling when response is received
      return response.message.content;
    } catch (error) {
      console.error("Ollama: Error during chat generation:", error);
      stopPolling(); // Ensure polling stops on error
      throw error;
    }
  }
}

export default new OllamaClient();
