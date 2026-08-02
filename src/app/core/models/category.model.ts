export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string;   // optionnel, pas encore en base — à confirmer
  count?: number;   // optionnel, nécessiterait un _count côté backend
}