interface PasswordResetData {
  resetLink: string;
  expiresInMinutes: number;
}

export function renderPasswordResetEmail(data: PasswordResetData): {
  subject: string;
  html: string;
} {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2>Réinitialisation de votre mot de passe</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe TechGear.</p>
      <p>
        
          href="${data.resetLink}"
          style="display:inline-block;padding:12px 24px;background:#f97316;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;"
        >
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p style="color:#64748b;font-size:14px;">
        Ce lien expire dans ${data.expiresInMinutes} minutes. Si vous n'êtes pas à l'origine de cette
        demande, vous pouvez ignorer cet email en toute sécurité — votre mot de passe restera inchangé.
      </p>
      <p style="color:#94a3b8;font-size:12px;word-break:break-all;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />${data.resetLink}
      </p>
    </div>
  `;

  return { subject: 'Réinitialisation de votre mot de passe TechGear', html };
}
