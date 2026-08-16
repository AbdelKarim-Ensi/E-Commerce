import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

interface ConfirmOptions {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  /** true pour les actions irréversibles (remboursement, suppression) — bouton rouge */
  danger?: boolean;
}

// Couleurs de marque TechGear, cohérentes avec le reste de l'admin
// (orange-500 pour les actions neutres, rouge pour le destructif).
const BRAND_ORANGE = '#f97316';
const DANGER_RED = '#dc2626';

@Injectable({ providedIn: 'root' })
export class AlertService {
  /**
   * Confirmation avant une action destructive ou importante.
   * Retourne `true` si l'utilisateur confirme, `false` sinon (annulation
   * ou fermeture par overlay/Échap).
   */
  async confirm(options: ConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.danger ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? 'Confirmer',
      cancelButtonText: options.cancelButtonText ?? 'Annuler',
      confirmButtonColor: options.danger ? DANGER_RED : BRAND_ORANGE,
      cancelButtonColor: '#64748b', // slate-500
      reverseButtons: true,
      focusCancel: options.danger, // évite un clic accidentel sur "Confirmer" pour le destructif
      customClass: { popup: 'swal-techgear-popup' },
    });
    return result.isConfirmed;
  }

  /**
   * Confirmation de succès centrée à l'écran, stylée aux couleurs
   * TechGear (orange/amber). Le style visuel (couleurs, bordure, ombre,
   * icône, animation d'entrée, backdrop blur) est défini dans styles.css
   * via les classes swal-techgear-* référencées ci-dessous.
   */
  success(message: string, title = 'Vos informations ont été mises à jour'): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title,
      html: `<span class="swal-techgear-subtitle">${message} 🎉</span>`,
      showConfirmButton: false,
      showCloseButton: true,
      timer: 2000,
      timerProgressBar: true,
      backdrop: 'rgba(0,0,0,0.45)',
      showClass: { popup: 'swal-techgear-show' },
      customClass: {
        popup: 'swal-techgear-popup',
        title: 'swal-techgear-title',
        icon: 'swal-techgear-icon',
        timerProgressBar: 'swal-techgear-progress',
        closeButton: 'swal-techgear-close',
      },
    });
  }

  /**
   * Alerte d'erreur avec exactement le même design que success() (popup,
   * bordure, ombre, titre, animation d'entrée, backdrop) — seule l'icône
   * change (croix rouge au lieu du ✓ vert), avec le même anneau orange
   * tournant pour rester cohérent visuellement.
   */
  error(message: string, title = 'Une erreur est survenue'): void {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title,
      html: `<span class="swal-techgear-subtitle">${message}</span>`,
      showConfirmButton: false,
      showCloseButton: true,
      timer: 2000,
      timerProgressBar: true,
      backdrop: 'rgba(0,0,0,0.45)',
      showClass: { popup: 'swal-techgear-show' },
      customClass: {
        popup: 'swal-techgear-popup',
        title: 'swal-techgear-title',
        icon: 'swal-techgear-icon',
        timerProgressBar: 'swal-techgear-progress',
        closeButton: 'swal-techgear-close',
      },
    });
  }

  /** Alerte d'info avec le même design que success()/error(). */
  info(message: string, title = 'Info'): void {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title,
      html: `<span class="swal-techgear-subtitle">${message}</span>`,
      showConfirmButton: false,
      showCloseButton: true,
      timer: 2000,
      timerProgressBar: true,
      backdrop: 'rgba(0,0,0,0.45)',
      showClass: { popup: 'swal-techgear-show' },
      customClass: {
        popup: 'swal-techgear-popup',
        title: 'swal-techgear-title',
        icon: 'swal-techgear-icon',
        timerProgressBar: 'swal-techgear-progress',
        closeButton: 'swal-techgear-close',
      },
    });
  }

  /**
   * Affiche un loader bloquant (ex. pendant un appel réseau long comme un
   * remboursement Stripe). À fermer explicitement avec close().
   */
  loading(message = 'Chargement...'): void {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  close(): void {
    Swal.close();
  }
}