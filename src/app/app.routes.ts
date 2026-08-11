import { Routes } from '@angular/router';
import { Home } from '@pages/home/home';
import { ProductList } from '@pages/product-list/product-list';
import { Cart } from '@pages/cart/cart';
import { Checkout } from '@pages/checkout/checkout';
import { Auth } from '@pages/auth/auth';
import { ForgotPassword } from '@pages/forgot-password/forgot-password';
import { ResetPassword } from '@pages/reset-password/reset-password';
import { VerifyEmail } from '@pages/verify-email/verify-email';
import { OrderHistory } from '@pages/order-history/order-history';
import { OrderConfirmation } from '@pages/order-confirmation/order-confirmation';
import { EarbudShowcase } from '@pages/product-list/earbud-showcase/earbud-showcase';
import { Profile } from '@pages/profile/profile';
import { authGuard } from '@guards/auth.guard';
import { adminGuard } from '@guards/admin.guard';
import { NotFound } from '@pages/not-found/not-found';
import { AdminLayout } from '@pages/admin/admin-layout/admin-layout';
import { AdminDashboard } from '@pages/admin/admin-dashboard/admin-dashboard';
import { AdminProducts } from '@pages/admin/admin-products/admin-products';
import { AdminProductForm } from '@pages/admin/admin-product-form/admin-product-form';
import { AdminOrders } from '@pages/admin/admin-orders/admin-orders';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'TechGear — Accueil'
  },
  {
    path: 'products/:id',
    component: EarbudShowcase,
    title: 'TechGear — Détail produit'
  },
  {
    path: 'products',
    component: ProductList,
    title: 'TechGear — Produits'
  },
  {
    path: 'cart',
    component: Cart,
    title: 'TechGear — Panier'
  },
  {
    path: 'checkout',
    component: Checkout,
    title: 'TechGear — Commande'
  },
  {
    path: 'login',
    component: Auth,
    title: 'TechGear — Connexion'
  },
  {
    path: 'register',
    component: Auth,
    title: 'TechGear — Inscription'
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
    title: 'TechGear — Mot de passe oublié'
  },
  {
    path: 'reset-password',
    component: ResetPassword,
    title: 'TechGear — Réinitialiser le mot de passe'
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
    title: 'TechGear — Vérification de l\'email'
  },
  {
    path: 'orders/:id',
    component: OrderConfirmation,
    title: 'TechGear — Confirmation de commande'
  },
  {
    path: 'orders',
    component: OrderHistory,
    title: 'TechGear — Mes commandes'
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
    title: 'TechGear — Mon profil'
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: AdminDashboard,
        title: 'TechGear — Administration'
      },
      {
        path: 'products',
        component: AdminProducts,
        title: 'TechGear — Admin Produits'
      },
      {
       
        path: 'products/new',
        component: AdminProductForm,
        title: 'TechGear — Ajouter un produit'
      },
      {
        path: 'products/:id/edit',
        component: AdminProductForm,
        title: 'TechGear — Modifier le produit'
      },
      {
        path: 'orders',
        component: AdminOrders,
        title: 'TechGear — Admin Commandes'
      }
    ]
  },
  {
    path: '**',
    component: NotFound,
    title: 'TechGear — Page introuvable'
  }
];