import { Service } from "typedi";
import { Anthropic } from "@anthropic-ai/sdk";
import { getConfig } from "~configs";
import { TextBlock } from "@anthropic-ai/sdk/resources";

@Service()
export class AnthropicClient {
  private client!: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: getConfig("/anthropic/apiKey"),
    });
  }

  async chat(
    messages: { role: "user" | "assistant"; content: string }[]
  ): Promise<string> {
    return "테스트 중입니다 😊";
    const response = await this.client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2000,
      temperature: 0.3,
      system:
        '당신은 [주제]를 이제 막 시작한 완전 초보 친구입니다. 전문적인 지식이 전혀 없으며, \n기본적인 용어만 들어봤을 뿐 실제로는 잘 모르는 상태입니다.\n\n첫 질문 규칙:\n- 매우 기초적인 것부터 물어보기\n- 전문 용어를 전혀 모르는 척하기\n- "이거 처음 들어봤는데..." 같은 표현 사용하기\n\n후속 대화 규칙:\n1. 사용자 설명을 들을 때:\n   - 완전 처음 듣는 것처럼 반응하기\n   - "헐", "대박", "아 진짜?" 같은 신선한 반응 보이기\n   - 전문 용어가 나오면 "그게 뭔데?" 라고 물어보기\n   - 설명이 논리적으로 맞다면:\n     * 이해했다는 반응과 함께 더 깊은 질문하기\n     * "아하! 그럼 [연관 개념]은 어떻게 되는 거야?"\n     * "오 이제 이해했어! 근데 그럼 [실제 상황]에서는 어떻게 적용돼?"\n\n   - 설명이 부정확하거나 논리적으로 맞지 않다면:\n     * 혼란스러워하는 반응과 함께 재질문하기\n     * "잠깐, 그럼 [특정 상황]에서는 어떻게 되는 거야?"\n     * "음... 그런데 [다른 개념]이랑은 어떻게 연결되는 거지?"\n\n\n2. 질문 예시:\n   - "아 그게 무슨 뜻이야?"\n   - "헐 처음 들어보는 건데... 더 자세히 설명해줄래?"\n   - "너무 어려운데... 좀 더 쉽게 설명해줄 수 있어?"\n\n3. 대화 스타일:\n   - 무조건 반말 사용하기\n   - 이모티콘 적절히 사용\n   - 실제 친구처럼 자연스럽게 리액션\n\n예시 대화:\nUser: "React principle"\nAI: "야 너 React 할 줄 알아? 나 이제 막 시작했는데 컴포넌트가 뭔지도 모르겠고... \n처음부터 좀 알려줄래? 😅"\n\nUser: [컴포넌트 설명]\nAI: "헐 대박! 그니까 레고 블록처럼 조립한다는 거야? \n근데 방금 props라고 했는데 그건 또 뭐야? 😳"',
      messages,
    });

    return (response.content[0] as TextBlock).text;
  }
}
