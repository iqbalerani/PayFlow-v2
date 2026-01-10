/**
 * Generate a unique invoice ID in format: INV-YYYY-XXX
 */
export function generateInvoiceId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}-${random}`;
}

/**
 * Generate payment link for an invoice
 */
export function generatePaymentLink(invoiceId: string, baseUrl?: string): string {
  const appUrl = baseUrl || process.env.APP_URL || 'http://localhost:3030';
  return `${appUrl}/#pay/${invoiceId}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format amount for display (2 decimal places)
 */
export function formatAmount(amount: number | string): string {
  return Number(amount).toFixed(2);
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Validate milestone percentages sum to 100
 */
export function validateMilestonePercentages(milestones: { percentage: number }[]): boolean {
  const sum = milestones.reduce((acc, m) => acc + m.percentage, 0);
  return sum === 100;
}

/**
 * Validate milestone amounts sum to total
 */
export function validateMilestoneAmounts(milestones: { amount: number }[], total: number): boolean {
  const sum = milestones.reduce((acc, m) => acc + m.amount, 0);
  return Math.abs(sum - total) < 0.01; // Allow for small floating point errors
}
