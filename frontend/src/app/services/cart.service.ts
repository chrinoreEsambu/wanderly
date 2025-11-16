import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  voyage: any;
  category: any;
  nombrePersonnes: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'bus_traveller_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(
    this.getCartFromStorage()
  );
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  private getCartFromStorage(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  addToCart(item: CartItem): void {
    const currentCart = this.getCartFromStorage();
    currentCart.push(item);
    this.saveCartToStorage(currentCart);
  }

  removeFromCart(index: number): void {
    const currentCart = this.getCartFromStorage();
    currentCart.splice(index, 1);
    this.saveCartToStorage(currentCart);
  }

  getCart(): CartItem[] {
    return this.getCartFromStorage();
  }

  getCartCount(): number {
    return this.getCartFromStorage().length;
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
    this.cartItemsSubject.next([]);
  }
}
