"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetOverlay } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export type CartItem = {
  id: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imagePath: string;
};

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleCartChange = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch (e) {
        console.error("Failed to parse cart:", e);
        setCartItems([]);
      }
    };

    handleCartChange();
    window.addEventListener("storage", handleCartChange);
    window.addEventListener("cartUpdated", handleCartChange);

    return () => {
      window.removeEventListener("storage", handleCartChange);
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    router.push("/kasa");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetOverlay className="bg-black/30" />
      <SheetContent className="w-full p-0 sm:max-w-lg bg-gradient-to-br from-stone-50 to-stone-100/50 backdrop-blur">
        <div className="h-full flex flex-col">
          {/* Header */}
          <SheetHeader className=" pb-4 border-b border-stone-200/50">
            <SheetTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              Koszyk
            </SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Twój koszyk jest pusty</p>
                  <p className="text-gray-500">Dodaj produkty, aby kontynuować zakupy</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                        <Image
                          src={item.imagePath}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-primary font-medium text-lg">
                          {formatPrice(item.priceInCents)}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          {formatPrice(item.priceInCents * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-stone-200/50 bg-white/50 backdrop-blur-sm rounded-t-2xl">
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Suma</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(subtotal)}</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Darmowa dostawa
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Bezpieczne płatności
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                >
                  <Sparkles className="w-5 h-5" />
                  Przejdź do kasy
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
