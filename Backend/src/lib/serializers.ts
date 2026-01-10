/**
 * Data serializers to convert Prisma camelCase to frontend snake_case
 */

export function serializeInvoice(invoice: any) {
  if (!invoice) return null;

  return {
    id: invoice.id,
    freelancer_wallet: invoice.freelancer?.walletAddress || invoice.freelancerWallet,
    client_wallet: invoice.clientWallet,
    client_email: invoice.clientEmail,
    client_name: invoice.clientName,
    title: invoice.title,
    description: invoice.description,
    total_amount: invoice.totalAmount,
    currency: invoice.currency,
    category: invoice.category,
    status: invoice.status,
    created_at: invoice.createdAt,
    milestones: invoice.milestones?.map(serializeMilestone) || [],
    escrow_contract: invoice.escrowContract
  };
}

export function serializeMilestone(milestone: any) {
  if (!milestone) return null;

  return {
    id: milestone.id,
    title: milestone.title,
    description: milestone.description,
    amount: milestone.amount,
    percentage: milestone.percentage,
    order: milestone.index,
    status: milestone.status,
    paid_at: milestone.paidAt,
    released_at: milestone.releasedAt
  };
}

export function serializeInvoiceList(invoices: any[]) {
  return invoices.map(serializeInvoice);
}
