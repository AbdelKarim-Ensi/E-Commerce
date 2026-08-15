export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
  };
}

export interface PaginatedReviews {
  data: Review[];
  total: number;
  page: number;
  totalPages: number;
}

// Avis enrichi des infos produit, utilisé sur la page de modération admin
export interface AdminReview extends Omit<Review, 'user'> {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  product: {
    name: string;
    slug: string;
    thumbnailUrl: string | null;
    imageUrl: string | null;
  };
}

export interface PaginatedAdminReviews {
  data: AdminReview[];
  total: number;
  page: number;
  totalPages: number;
}