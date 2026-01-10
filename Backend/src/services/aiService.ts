import { AIGenerateResponse } from '../types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class AIService {
  /**
   * Generate invoice from natural language description
   */
  static async generateInvoice(description: string): Promise<AIGenerateResponse> {
    try {
      const prompt = `You are an expert financial assistant. Your task is to extract project details from natural language and structure them into a formal invoice.

Work Description: "${description}"

Generate a JSON response with this exact structure:
{
  "title": "Brief project title (max 100 chars)",
  "description": "Detailed description of the work (100-500 chars)",
  "clientName": "Client name if mentioned, otherwise null",
  "totalAmount": number (whole number),
  "currency": "MNEE",
  "category": "one of: design, development, consulting, marketing, writing, other",
  "milestones": [
    {
      "title": "Milestone name (concise, max 50 chars)",
      "description": "What is delivered in this milestone (max 200 chars)",
      "amount": number (must be whole number),
      "percentage": number (integer between 1-100)
    }
  ],
  "suggestedMessage": "Professional message to send to client about the invoice (2-3 sentences)"
}

Rules:
- If no milestone split is specified, suggest a reasonable split based on project type (e.g., 30/40/30 for design, 50/50 for small projects, 25/25/25/25 for large projects)
- All amounts must be whole numbers (no decimals)
- Percentages must add up to exactly 100
- Generate 1-4 milestones depending on project complexity
- Keep all text concise and professional
- Milestone titles should indicate the phase (e.g., "Upfront", "First Draft", "Final Delivery")

Respond ONLY with valid JSON, no markdown formatting or explanation.`;

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3030',
          'X-Title': 'PayFlow'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || '';

      // Remove any markdown formatting if present
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const invoiceData: AIGenerateResponse = JSON.parse(jsonText);

      // Validate the response
      if (!invoiceData.title || !invoiceData.milestones || invoiceData.milestones.length === 0) {
        throw new Error('Invalid AI response structure');
      }

      // Ensure percentages sum to 100
      const percentageSum = invoiceData.milestones.reduce((sum, m) => sum + m.percentage, 0);
      if (percentageSum !== 100) {
        // Adjust the last milestone to make it exactly 100
        const diff = 100 - percentageSum;
        invoiceData.milestones[invoiceData.milestones.length - 1].percentage += diff;
      }

      // Ensure amounts sum to total
      const amountSum = invoiceData.milestones.reduce((sum, m) => sum + m.amount, 0);
      if (Math.abs(amountSum - invoiceData.totalAmount) > 0.01) {
        // Adjust amounts proportionally
        invoiceData.milestones = invoiceData.milestones.map((m, i) => ({
          ...m,
          amount: Math.round((m.percentage / 100) * invoiceData.totalAmount)
        }));

        // Fix rounding errors by adjusting the last milestone
        const newSum = invoiceData.milestones.reduce((sum, m) => sum + m.amount, 0);
        if (newSum !== invoiceData.totalAmount) {
          invoiceData.milestones[invoiceData.milestones.length - 1].amount +=
            invoiceData.totalAmount - newSum;
        }
      }

      return invoiceData;
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate invoice'
      );
    }
  }

  /**
   * Generate professional message for client
   */
  static async generateMessage(
    invoiceTitle: string,
    clientName: string,
    totalAmount: number,
    type: 'payment_request' | 'reminder' | 'thank_you' = 'payment_request'
  ): Promise<string> {
    try {
      let prompt = '';

      switch (type) {
        case 'payment_request':
          prompt = `Write a friendly, professional message from a freelancer to a client named ${clientName} about an invoice for "${invoiceTitle}" totaling ${totalAmount} MNEE. Mention that the payment is secured via PayFlow smart contract escrow. Keep it 2-3 sentences. Be warm but professional.`;
          break;
        case 'reminder':
          prompt = `Write a polite reminder message to ${clientName} about a pending payment for "${invoiceTitle}" (${totalAmount} MNEE). Keep it friendly and understanding. 2-3 sentences.`;
          break;
        case 'thank_you':
          prompt = `Write a thank you message to ${clientName} for completing payment on "${invoiceTitle}". Express gratitude and openness to future work. 2-3 sentences.`;
          break;
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3030',
          'X-Title': 'PayFlow'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const message = data.choices[0]?.message?.content?.trim() || '';

      return message;
    } catch (error) {
      console.error('AI message generation error:', error);
      throw new Error('Failed to generate message');
    }
  }
}
