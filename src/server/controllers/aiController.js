import { geminiService } from '../services/geminiService.js';

export const askAiAssistant = async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'O parâmetro "prompt" é obrigatório e deve ser uma string.'
      });
    }

    const response = await geminiService.askB2BAssistant(prompt, context || {});
    return res.json({
      success: true,
      data: response
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Erro no processamento com a IA Gemini',
      message: err.message
    });
  }
};
