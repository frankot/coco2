"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPLN } from "@/lib/formatter";
import { motion, AnimatePresence } from "framer-motion";

// Define types for cart
export type CartItem = {
  id: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imagePath: string;
};

type CartProps = {
  isOpen: boolean;
  onClose: () => void;
  navbarHeight: number;
  onOpenCart?: () => void;
};

// Custom scrollbar styles
const scrollbarStylesWebkit = `
  .cart-content::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  .cart-content::-webkit-scrollbar-thumb {
    background-color: hsl(var(--primary));
    border-radius: 8px;
  }
  .cart-content::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const scrollbarStyles = {
  scrollbarWidth: "thin",
  scrollbarColor: "hsl(var(--primary)) transparent",
  WebkitOverflowScrolling: "touch",
  overflowY: "scroll",
} as React.CSSProperties;

// CartOverlay component - memoized to prevent unnecessary rerenders
const CartOverlay = memo(function CartOverlay({
  isOpen,
  navbarHeight,
  onClose,
}: {
  isOpen: boolean;
  navbarHeight: number;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 right-0 z-20 bg-primary/30 backdrop-blur-sm"
          style={{
            top: `${navbarHeight}px`,
            height: `calc(100vh - ${navbarHeight}px)`,
          }}
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
});

// CartFloatingButton component - memoized
const CartFloatingButton = memo(function CartFloatingButton({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick?: () => void;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        exit={{ x: 100 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <Button
          size="lg"
          className="p-6 shadow-none flex text-background items-center bg-primary"
          onClick={onClick}
        >
          <ShoppingBag className="size-7" />
        </Button>
      </motion.div>
    </div>
  );
});

// EmptyCart component - memoized
const EmptyCart = memo(function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 flex-grow flex flex-col items-center justify-center text-gray-500">
      <ShoppingBag size={64} strokeWidth={1.5} className="mb-6 opacity-50" />
      <p className="text-center mb-2 text-xl">Twój koszyk jest pusty</p>
      <p className="text-center text-md mb-6">Dodaj produkty do koszyka</p>
      <Button onClick={onClose} size="lg" className="mt-4">
        Kontynuuj zakupy
      </Button>
    </div>
  );
});

// CartHeader component - memoized
const CartHeader = memo(function CartHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 border-b flex items-center justify-between pl-10">
      <h2 className="text-3xl font-galindo flex items-center text-primary">Koszyk</h2>
      <button onClick={onClose} className="text-primary hover:text-secondary transition-colors">
        <X size={32} />
      </button>
    </div>
  );
});

// CartItemComponent - memoized with efficient callback handlers
const CartItemComponent = memo(function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const handleIncrement = useCallback(() => {
    onUpdateQuantity(item.id, item.quantity + 1);
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleDecrement = useCallback(() => {
    onUpdateQuantity(item.id, item.quantity - 1);
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  return (
    <li className="flex gap-4 pb-6 border-b">
      {/* Product image */}
      <div className="size-28 rounded-md flex-shrink-0 relative overflow-hidden">
        <Image
          src={item.imagePath}
          alt={item.name}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </div>

      {/* Product details */}
      <div className="flex-grow">
        <div className="flex justify-between">
          <Link href={`/product/${item.id}`} className="font-medium text-lg hover:underline">
            {item.name}
          </Link>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <p className="text-primary text-md font-medium my-2">{formatPLN(item.priceInCents)}</p>
        <div className="flex items-center mt-3">
          <button
            onClick={handleDecrement}
            className="p-1.5 border rounded-md text-primary hover:bg-gray-100 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="mx-3 w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={handleIncrement}
            className="p-1.5 border rounded-md text-primary hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </li>
  );
});

// CartContent component - memoized
const CartContent = memo(function CartContent({
  items,
  onUpdateQuantity,
  onRemove,
  onClose,
}: {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="p-6 flex-grow cart-content" style={scrollbarStyles}>
      {items.length > 0 ? (
        <ul className="space-y-6">
          {items.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
});

// CartFooter component - memoized with precalculated values
const CartFooter = memo(function CartFooter({
  items,
  discount,
  discountCode,
  isApplyingDiscount,
  onDiscountCodeChange,
  onApplyDiscount,
}: {
  items: CartItem[];
  discount: number;
  discountCode: string;
  isApplyingDiscount: boolean;
  onDiscountCodeChange: (code: string) => void;
  onApplyDiscount: () => void;
}) {
  // Calculate cart totals
  const subtotal = items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const total = subtotal - discountAmount;

  if (items.length === 0) return null;

  const handleDiscountCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onDiscountCodeChange(e.target.value);
    },
    [onDiscountCodeChange]
  );

  return (
    <div className="p-6 border-t">
      {/* Discount code */}
      <div className="mb-6">
        <p className="font-medium mb-2">Kod rabatowy</p>
        <div className="flex gap-2">
          <Input
            value={discountCode}
            onChange={handleDiscountCodeChange}
            placeholder="COCO10"
            className="bg-gray-50"
          />
          <Button
            onClick={onApplyDiscount}
            variant="outline"
            disabled={isApplyingDiscount || !discountCode.trim()}
            className="shrink-0"
          >
            {isApplyingDiscount ? "..." : "Dodaj"}
          </Button>
        </div>
      </div>

      {/* Cart summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Suma</span>
          <span className="font-medium">{formatPLN(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Rabat ({discount}%)</span>
            <span>-{formatPLN(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold pt-3 border-t text-primary">
          <span>Do zapłaty</span>
          <span>{formatPLN(total)}</span>
        </div>
      </div>

      {/* Checkout button */}
      <Button asChild className="w-full" size="lg">
        <Link href="/kasa">Przejdź do kasy</Link>
      </Button>
    </div>
  );
});

// CartSidePanel component - memoized
const CartSidePanel = memo(function CartSidePanel({
  isOpen,
  navbarHeight,
  children,
}: {
  isOpen: boolean;
  navbarHeight: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className="fixed left-0 z-20  w-80 bg-background shadow-none rounded-none flex flex-col"
      style={{
        top: `${navbarHeight}px`,
        height: `calc(100vh - ${navbarHeight}px)`,
      }}
    >
      {children}
    </motion.div>
  );
});

// Main Cart component
export default function Cart({ isOpen, onClose, navbarHeight, onOpenCart }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discount, setDiscount] = useState(0); // Discount percentage
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(false);

  // Load cart from local storage - optimized with error handling
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          // Update visibility immediately based on cart state
          setIsFloatingButtonVisible(parsedCart.length > 0 && !isOpen);
        } else {
          setCartItems([]);
          setIsFloatingButtonVisible(false);
        }
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
        localStorage.removeItem("cart");
        setCartItems([]);
        setIsFloatingButtonVisible(false);
      }
      setIsInitialized(true);
    };

    loadCart();
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
    };
  }, [isOpen]);

  // Save cart to local storage whenever it changes - optimized
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
      }
    }
  }, [cartItems, isInitialized]);

  // Update floating button visibility based on cart state and panel state - memoized logic
  useEffect(() => {
    // Only show the floating button when there are items in the cart AND the cart panel is closed
    setIsFloatingButtonVisible(cartItems.length > 0 && !isOpen);
  }, [cartItems.length, isOpen]);

  // Event handlers - optimized with useCallback
  const updateQuantity = useCallback((id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity becomes 0 or negative
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const applyDiscount = useCallback(() => {
    setIsApplyingDiscount(true);
    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes: apply a 10% discount for code "COCO10"
      if (discountCode.trim().toUpperCase() === "COCO10") {
        setDiscount(10);
      } else {
        setDiscount(0);
        alert("Nieprawidłowy kod rabatowy");
      }
      setIsApplyingDiscount(false);
    }, 800);
  }, [discountCode]);

  // Memoized derived values
  const hasCartItems = cartItems.length > 0;
  const showEmptyCart = isOpen && !hasCartItems;

  return (
    <>
      {/* Add the webkit scrollbar styles */}
      <style jsx global>
        {scrollbarStylesWebkit}
      </style>

      {/* Floating Cart Button - only show when panel is not open */}
      <CartFloatingButton isVisible={isFloatingButtonVisible} onClick={onOpenCart} />

      {/* Cart Overlay - always render but conditionally show */}
      <CartOverlay isOpen={isOpen} navbarHeight={navbarHeight} onClose={onClose} />

      {/* Cart Side Panel - always render but conditionally show */}
      <CartSidePanel isOpen={isOpen} navbarHeight={navbarHeight}>
        {/* Cart header */}
        <CartHeader onClose={onClose} />

        {/* Cart content with custom scrollbar */}
        {showEmptyCart ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <CartContent
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
            onClose={onClose}
          />
        )}

        {/* Cart footer - only show if items exist */}
        {hasCartItems && (
          <CartFooter
            items={cartItems}
            discount={discount}
            discountCode={discountCode}
            isApplyingDiscount={isApplyingDiscount}
            onDiscountCodeChange={setDiscountCode}
            onApplyDiscount={applyDiscount}
          />
        )}
      </CartSidePanel>
    </>
  );
}
