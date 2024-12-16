import { Service } from "typedi";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

declare module "openai/resources" {
  interface ChatCompletion {
    citations: any[];
  }
}

@Service()
export class PerplexityClient {
  private static model = "llama-3.1-sonar-small-128k-online";
  private client!: OpenAI;

  private static systemMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "Be precise and concise.",
  };

  constructor() {
    this.client = new OpenAI({
      baseURL: "https://api.perplexity.ai",
      apiKey: process.env.PERPLEXITY_API_KEY,
    });
  }

  async chat(
    messages: ChatCompletionMessageParam[]
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    const dummyResponse = {
      citations: [],
      id: "test",
      choices: [
        {
          finish_reason: "stop",
          index: 0,
          message: {
            content: "test",
            role: "assistant",
            refusal: "test",
          },
          logprobs: null,
        },
      ],
      created: 0,
      model: "test",
      object: "chat.completion",
    };

    return new Promise((resolve) =>
      setTimeout(() => resolve(dummyResponse as any), 5000)
    );

    return this.client.chat.completions.create({
      model: PerplexityClient.model,
      messages: [PerplexityClient.systemMessage, ...messages],
    });
  }
}
