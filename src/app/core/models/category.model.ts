export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
  count?: number;   // optionnel, pas en base (nécessiterait un _count backend) — conservé pour compat
  image?: string;   // optionnel, pas en base — conservé pour compat
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  emoji?: string | null;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;