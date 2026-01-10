import api from '../lib/api';

export interface AIInvoiceData {
  title: string;
  description: string;
  totalAmount: number;
  category?: string;
  milestones: {
    title: string;
    description: string;
    amount: number;
    percentage: number;
  }[];
}

class AIService {
  /**
   * Generate invoice from natural language description
   */
  async generateInvoice(description: string): Promise<AIInvoiceData> {
    const response = await api.post<AIInvoiceData>('/ai/generate', { description });
    return response.data;
  }

  /**
   * Generate professional message for client
   */
  async generateMessage(
    invoiceTitle: string,
    clientName: string,
    totalAmount: number,
    type: 'payment_request' | 'reminder' | 'thank_you' = 'payment_request'
  ): Promise<string> {
    const response = await api.post<{ message: string }>('/ai/message', {
      invoiceTitle,
      clientName,
      totalAmount,
      type,
    });
    return response.data.message;
  }
}

export default new AIService();
