import dotenv from 'dotenv';

dotenv.config();

/**
 * Service for Google Gemini AI integrations in Parque Jaime Lerner B2B
 */
export class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Generates content using Google Gemini
   * @param {string} prompt - The prompt to submit
   * @param {Object} options - Additional options like system instruction or temperature
   */
  async generateText(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY não configurada no ambiente (.env).');
    }

    const candidateModels = [
      'gemini-flash-latest',
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ];

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
        const payload = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxTokens ?? 1024
          }
        };

        if (options.systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: options.systemInstruction }]
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return {
            success: true,
            model,
            text: data.candidates[0].content.parts[0].text.trim()
          };
        }

        lastError = data.error?.message || `Status HTTP ${response.status}`;
      } catch (err) {
        lastError = err.message;
      }
    }

    throw new Error(`Falha ao comunicar com Google Gemini: ${lastError}`);
  }

  /**
   * Specialized assistant for Parque Jaime Lerner operations
   */
  async askB2BAssistant(userMessage, context = {}) {
    const systemPrompt = `Você é o Assistente Virtual Inteligente do Parque Jaime Lerner (Rua da Música, Curitiba - PR) para a Plataforma B2B de Agências e Distribuição Turística.
Responda de forma profissional, direta e assertiva sobre:
- Distribuição turística B2B, cotas de inventário e regras de agências parceiras.
- Estrutura de precificação (taxa de serviço B2B padrão de 6%).
- Emissão, lote e validação de vouchers com QR Code para catracas.
- Módulo de Equipe de Vendas, promotores, links rastreáveis e comissões.
Contexto adicional do sistema: ${JSON.stringify(context)}`;

    return this.generateText(userMessage, {
      systemInstruction: systemPrompt,
      temperature: 0.4
    });
  }
}

export const geminiService = new GeminiService();
export default geminiService;
