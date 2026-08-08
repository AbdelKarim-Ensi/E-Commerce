import { Routes } from '@angular/router';
import { Home } from '@pages/home/home';
import { ProductList } from '@pages/product-list/product-list';
import { Cart } from '@pages/cart/cart';
import { Checkout } from '@pages/checkout/checkout';
import { Auth } from '@pages/auth/auth';
import { OrderHistory } from '@pages/order-history/order-history';
import { OrderConfirmation } from '@pages/order-confirmation/order-confirmation';
import { EarbudShowcase } from '@pages/product-list/earbud-showcase/earbud-showcase';
import { Profile } from '@pages/profile/profile';
import { authGuard } from '@guards/auth.guard';
import { NotFound } from '@pages/not-found/not-found';

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
    // canActivate: [authGuard],
    title: 'TechGear — Mon profil'
  },
  {
    path: '**',
    component: NotFound,
    title: 'TechGear — Page introuvable'
  }
];