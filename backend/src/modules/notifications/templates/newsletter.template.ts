interface NewsletterEmailData {
  subject: string;
  message: string;
  ctaLink?: string;
  ctaText?: string;
  unsubscribeLink: string;
}

export function renderNewsletterEmail(data: NewsletterEmailData): {
  subject: string;
  html: string;
} {
  const ctaBlock =
    data.ctaLink && data.ctaText
      ? `
        <div style="text-align:center;margin:24px 0;">
          <a href="${data.ctaLink}"
             style="background:#f59e0b;color:#fff;padding:12px 28px;border-radius:8px;
                    text-decoration:none;font-weight:bold;display:inline-block;">
            ${data.ctaText}
          </a>
        </div>`
      : '';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#18181b;">${data.subject}</h2>
      <p style="color:#3f3f46;line-height:1.6;white-space:pre-line;">${data.message}</p>
      ${ctaBlock}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
      <p style="font-size:12px;color:#a1a1aa;">
        Vous recevez cet email car vous êtes inscrit à la newsletter TechGear.
        <br />
        <a href="${data.unsubscribeLink}" style="color:#a1a1aa;text-decoration:underline;">
          Se désinscrire
        </a>
      </p>
    </div>
  `;

  return { subject: data.subject, html };
}
