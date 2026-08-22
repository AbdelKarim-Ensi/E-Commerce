interface OrderCancelledData {
  orderId: string;
  totalAmount: number;
  refunded: boolean;
}

export function renderOrderCancelledEmail(data: OrderCancelledData): {
  subject: string;
  html: string;
} {
  const formattedAmount = data.totalAmount.toFixed(2);

  const refundNotice = data.refunded
    ? `<p style="color:#059669;font-weight:bold;">
         Le montant de ${formattedAmount} € a été remboursé et sera crédité sur votre moyen de
         paiement d'origine sous quelques jours ouvrés.
       </p>`
    : `<p style="color:#b45309;">
         Aucun débit n'a été effectué pour cette commande, aucune action supplémentaire n'est
         nécessaire de votre part.
       </p>`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2>Votre commande a été annulée</h2>
      <p>Votre commande <strong>#${data.orderId}</strong> d'un montant de ${formattedAmount} € a été annulée.</p>
      ${refundNotice}
      <p style="color:#64748b;font-size:14px;">
        Si vous avez des questions concernant cette annulation, n'hésitez pas à contacter notre
        support client.
      </p>
    </div>
  `;

  return { subject: `Commande #${data.orderId} annulée`, html };
}
