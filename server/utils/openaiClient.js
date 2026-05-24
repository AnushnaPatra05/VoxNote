const OpenAI = require('openai');

let client = null;

const getOpenAIClient = () => {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

module.exports = { getOpenAIClient };