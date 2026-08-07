export interface ShippingOption {
  id: 'standard' | 'express' | 'nextday';
  label: string;
  description: string;
  price: number;
}

export type PaymentTab = 'card' | 'paypal' | 'applepay';
export type CheckoutStep = 1 | 2 | 3;

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  saveAddress: boolean;
}