interface OrderConfirmationData {
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
}

export function renderOrderConfirmationEmail(data: OrderConfirmationData): {
  subject: string;
  html: string;
} {
  const rows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${item.unitPrice.toFixed(2)} €</td>
        </tr>`,
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2>Merci pour votre commande, ${data.customerName} !</h2>
      <p>Votre commande <strong>#${data.orderId}</strong> a bien été confirmée et payée.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:2px solid #333;">Produit</th>
            <th style="text-align:center;padding:8px;border-bottom:2px solid #333;">Qté</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #333;">Prix</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:16px;"><strong>Total : ${data.totalAmount.toFixed(2)} €</strong></p>
      <p>Vous trouverez votre facture en pièce jointe.</p>
    </div>
  `;

  return { subject: `Confirmation de commande #${data.orderId}`, html };
}