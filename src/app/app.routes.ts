import { Routes } from '@angular/router';
import { Home } from '@pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'TechGear — Accueil'
  },
  {
    path: 'products',
    loadComponent: () => import('@pages/product-list/product-list').then(m => m.ProductList),
    title: 'TechGear — Produits'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('@pages/product-detail/product-detail').then(m => m.ProductDetail),
    title: 'TechGear — Détail produit'
  },
  {
    path: 'cart',
    loadComponent: () => import('@pages/cart/cart').then(m => m.Cart),
    title: 'TechGear — Panier'
  },
  {
    path: 'checkout',
    loadComponent: () => import('@pages/checkout/checkout').then(m => m.Checkout),
    title: 'TechGear — Commande'
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login').then(m => m.Login),
    title: 'TechGear — Connexion'
  },
  {
    path: 'register',
    loadComponent: () => import('@pages/register/register').then(m => m.Register),
    title: 'TechGear — Inscription'
  },
  {
    path: 'orders',
    loadComponent: () => import('@pages/order-history/order-history').then(m => m.OrderHistory),
    title: 'TechGear — Mes commandes'
  },
  {
    path: '**',
    redirectTo: ''
  }
];