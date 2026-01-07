
import { GoogleGenAI, Type } from "@google/genai";
import { Invoice, InvoiceStatus, MilestoneStatus } from "../types";

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateInvoiceFromPrompt(prompt: string, freelancerWallet: string): Promise<Partial<Invoice>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse this freelancer work description into a structured invoice: "${prompt}"`,
    config: {
      systemInstruction: "You are an expert financial assistant. Your task is to extract project details from natural language and structure them into a formal invoice. Suggest 1-4 logical milestones based on the description if the user doesn't specify them. Ensure the sum of milestone amounts equals the total amount. Percentages must sum to 100.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          client_name: { type: Type.STRING },
          description: { type: Type.STRING },
          total_amount: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          category: { type: Type.STRING },
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                percentage: { type: Type.NUMBER },
              },
              required: ["title", "amount", "percentage"]
            }
          }
        },
        required: ["title", "client_name", "total_amount", "milestones"]
      }
    }
  });

  const parsed = JSON.parse(response.text || "{}");
  
  return {
    ...parsed,
    id: `INV-${Date.now().toString().slice(-6)}`,
    freelancer_wallet: freelancerWallet,
    status: InvoiceStatus.PENDING,
    created_at: new Date().toISOString(),
    milestones: parsed.milestones.map((m: any, idx: number) => ({
      ...m,
      id: `MS-${idx + 1}`,
      status: MilestoneStatus.PENDING,
      order: idx + 1
    }))
  };
}

export async function generateClientMessage(invoice: Invoice): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a friendly, professional message from a freelancer to a client named ${invoice.client_name} about an invoice for ${invoice.title} totaling ${invoice.total_amount} ${invoice.currency}. Mention that the payment is secured via PayFlow Escrow.`,
  });
  return response.text || "";
}
