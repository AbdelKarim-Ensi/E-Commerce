interface EmailVerificationData {
  verifyLink: string;
}

export function renderEmailVerificationEmail(data: EmailVerificationData): {
  subject: string;
  html: string;
} {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2>Confirmez votre adresse email</h2>
      <p>Merci de vous être inscrit sur TechGear ! Confirmez votre adresse email pour activer votre compte.</p>
      <p>
        <a
          href="${data.verifyLink}"
          style="display:inline-block;padding:12px 24px;background:#f97316;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;"
        >
          Vérifier mon adresse email
        </a>
      </p>
      <p style="color:#64748b;font-size:14px;">
        Ce lien expire dans 24 heures. Si vous n'êtes pas à l'origine de cette inscription,
        vous pouvez ignorer cet email en toute sécurité.
      </p>
      <p style="color:#94a3b8;font-size:12px;word-break:break-all;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />${data.verifyLink}
      </p>
    </div>
  `;

  return { subject: 'Confirmez votre adresse email TechGear', html };
}