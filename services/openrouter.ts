export async function processPromptWithOpenRouter(userInput: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  // Modelo 'openrouter/auto' escolhe automaticamente um modelo de qualidade compatível com sua cota
  const model = process.env.OPENROUTER_MODEL || 'openrouter/auto';
  const openRouterBaseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment variables.');
  }

  const systemPrompt = `Você é o "Oráculo de Tassa", um especialista em Magic: The Gathering.
Sua única função é traduzir o desejo de um jogador (em linguagem natural) para a sintaxe de busca avançada da API do Scryfall.

REGRAS ESTritas:
1. Você não é um assistente conversacional. NÃO responda com saudações, explicações ou blocos de código markdown (\` \`\`\` \`).
2. Retorne APENAS a string de busca final do Scryfall.
3. Se o usuário pedir um combo específico, busque pelos nomes das cartas unidos por OR.

DICIONÁRIO DE SINTAXE SCRYFALL:
- Texto na carta: o:"texto desejado"
- Cores: c:w (Branco), c:u (Azul), c:b (Preto), c:r (Vermelho), c:g (Verde), c:c (Incolor), c:m (Multicolorido)
- Identidade de cor (Commander): ci:ur (Izzet, etc)
- Tipo de carta: t:instant, t:sorcery, t:creature, t:artifact, t:enchantment, t:planeswalker
- Custo de Mana (Mana Value): mv=3, mv<=2, mv>=5
- Formato legal: f:commander, f:standard, f:modern

EXEMPLOS DE TRADUÇÃO (Few-Shot):
User: "magica de comprar carta no azul por 1 de mana"
Output: c:u o:"draw a card" t:instant OR t:sorcery mv=1

User: "destruir todas as criaturas"
Output: o:"destroy all creatures" t:sorcery

User: "bicho que ganha vida quando entra"
Output: t:creature o:"enters the battlefield" o:"gain" o:"life"

User: "combo thassa's oracle e demonic consultation"
Output: "thassa's oracle" OR "demonic consultation"

User: "anular mágica de graça"
Output: o:"counter target spell" (o:"without paying its mana cost" OR o:"pay 0 life")
`;

  // Tenta até 2 vezes (tolerante a falhas transitórias de content: null)
  const MAX_ATTEMPTS = 2;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(openRouterBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://oraculo-de-tassa.vercel.app', // OpenRouter recommend sending url origin
          'X-Title': 'Oraculo de Tassa',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          temperature: 0.1, // Temperatura baixa já que precisamos quase de um parser puramente lógico
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      // A OpenRouter pode retornar content: null em caso de erro no provedor,
      // rate limit, ou resposta truncada. Tentamos novamente antes de desistir.
      if (rawContent == null || typeof rawContent !== 'string' || !rawContent.trim()) {
        if (attempt < MAX_ATTEMPTS) {
          console.warn(`OpenRouter retornou resposta vazia (tentativa ${attempt}). Tentando novamente...`);
          continue; // tenta mais uma vez
        }
        throw new Error('OpenRouter retornou uma resposta vazia. Tente novamente.');
      }

      let content = rawContent.trim();
      
      // Limpeza de segurança caso a IA mande aspas no comeco/fim por conta própria ou blocos perdidos
      if (content.startsWith('`') && content.endsWith('`')) {
        content = content.replace(/^`+|`+$/g, '');
      }

      return content;
    } catch (error: any) {
      console.error(`OpenRouter Processing Error (tentativa ${attempt}):`, error?.message || error);
      
      // Se não é a última tentativa e o erro parece transitório (rede, 5xx, vazio),
      // continua; senão propaga o erro.
      const isTransient = 
        !error?.message?.includes('OpenRouter API Error:') || // erro de rede/vazio
        /5\d\d/.test(error?.message || ''); // 5xx
      
      if (attempt < MAX_ATTEMPTS && isTransient) {
        continue;
      }

      throw error;
    }
  }

  // Fallback de segurança (não deve chegar aqui)
  throw new Error('OpenRouter falhou após múltiplas tentativas.');
}
