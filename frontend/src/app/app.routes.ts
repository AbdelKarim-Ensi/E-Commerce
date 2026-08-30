import { Routes } from '@angular/router';
import { Home } from '@pages/home/home';
import { authGuard } from '@guards/auth.guard';
import { adminGuard } from '@guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'TechGear — Accueil'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('@pages/product-list/earbud-showcase/earbud-showcase').then(m => m.EarbudShowcase),
    title: 'TechGear — Détail produit'
  },
  {
    path: 'products',
    loadComponent: () => import('@pages/product-list/product-list').then(m => m.ProductList),
    title: 'TechGear — Produits'
  },
  {
    path: 'cart',
    loadComponent: () => import('@pages/cart/cart').then(m => m.Cart),
    title: 'TechGear — Panier'
  },
  {
    path: 'checkout',
    loadComponent: () => import('@pages/checkout/checkout').then(m => m.Checkout),
    canActivate: [authGuard],
    title: 'TechGear — Commande'
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/auth/auth').then(m => m.Auth),
    title: 'TechGear — Connexion'
  },
  {
    path: 'register',
    loadComponent: () => import('@pages/auth/auth').then(m => m.Auth),
    title: 'TechGear — Inscription'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('@pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
    title: 'TechGear — Mot de passe oublié'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('@pages/reset-password/reset-password').then(m => m.ResetPassword),
    title: 'TechGear — Réinitialiser le mot de passe'
  },
  {
    path: 'verify-email',
    loadComponent: () => import('@pages/verify-email/verify-email').then(m => m.VerifyEmail),
    title: 'TechGear — Vérification de l\'email'
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('@pages/order-confirmation/order-confirmation').then(m => m.OrderConfirmation),
    title: 'TechGear — Confirmation de commande'
  },
  {
    path: 'orders',
    loadComponent: () => import('@pages/order-history/order-history').then(m => m.OrderHistory),
    title: 'TechGear — Mes commandes'
  },
  {
    path: 'profile',
    loadComponent: () => import('@pages/profile/profile').then(m => m.Profile),
    canActivate: [authGuard],
    title: 'TechGear — Mon profil'
  },
  {
    path: 'admin',
    loadComponent: () => import('@pages/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('@pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
        title: 'TechGear — Administration'
      },
      {
        path: 'products',
        loadComponent: () => import('@pages/admin/admin-products/admin-products').then(m => m.AdminProducts),
        title: 'TechGear — Admin Produits'
      },
      {
        path: 'products/new',
        loadComponent: () => import('@pages/admin/admin-product-form/admin-product-form').then(m => m.AdminProductForm),
        title: 'TechGear — Ajouter un produit'
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('@pages/admin/admin-product-form/admin-product-form').then(m => m.AdminProductForm),
        title: 'TechGear — Modifier le produit'
      },
      {
        path: 'orders',
        loadComponent: () => import('@pages/admin/admin-orders/admin-orders').then(m => m.AdminOrders),
        title: 'TechGear — Admin Commandes'
      },
      {
        path: 'users',
        loadComponent: () => import('@pages/admin/admin-users/admin-users').then(m => m.AdminUsers),
        title: 'TechGear — Admin Utilisateurs'
      },
      {
        path: 'newsletter',
        loadComponent: () => import('@pages/admin/admin-newsletter/admin-newsletter').then(m => m.AdminNewsletter),
        title: 'TechGear — Admin Newsletter'
      },
      {
        path: 'reviews',
        loadComponent: () => import('@pages/admin/admin-reviews/admin-reviews').then(m => m.AdminReviews),
        title: 'TechGear — Admin Avis'
      },
      {
        path: 'categories',
        loadComponent: () => import('@pages/admin/admin-categories/admin-categories').then(m => m.AdminCategories),
        title: 'TechGear — Admin Catégories'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('@pages/not-found/not-found').then(m => m.NotFound),
    title: 'TechGear — Page introuvable'
  }
];