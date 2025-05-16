"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, BanknoteIcon, ShoppingBag, LogIn, User, Trash2, Loader2 } from "lucide-react";
import { formatPLN } from "@/lib/formatter";
import { createOrder } from "./_actions";

// Import cart item type from Cart component
type CartItem = {
  id: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imagePath: string;
};

// Payment method type to match schema
type PaymentMethod = "BANK_TRANSFER" | "STRIPE";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "login" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ")[1] || "",
    phoneNumber: "",
    email: session?.user?.email || "",
    street: "",
    city: "",
    postalCode: "",
    country: "Polska",
    paymentMethod: "BANK_TRANSFER" as PaymentMethod,
  });

  // Load cart items from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
    }
  }, []);

  // Update form when session changes
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || prev.firstName,
        lastName: session.user.name?.split(" ")[1] || prev.lastName,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value as PaymentMethod,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("Twój koszyk jest pusty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        ...formData,
        cartItems,
        userId: session?.user?.id,
      };

      // Submit order to server action
      const result = await createOrder(orderData);

      if (result.success) {
        // Clear cart after successful order
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        // Redirect to order confirmation page
        router.push(
          `/kasa/zlozone-zamowienie?orderId=${result.orderId}&payment=${formData.paymentMethod}`
        );
      } else {
        setError(result.error || "Wystąpił błąd podczas składania zamówienia");

        // If it's an authentication error, suggest login
        if (result.error?.includes("użytkownika")) {
          setCheckoutMode("login");
        }
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setError("Wystąpił błąd podczas składania zamówienia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  const tax = Math.round(subtotal * 0.23); // 23% VAT
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  // Check if cart is empty
  if (isClient && cartItems.length === 0) {
    return (
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-bold mb-6">Kasa</h1>

        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Twój koszyk jest pusty</h2>
            <p className="text-muted-foreground mb-6">Dodaj produkty do koszyka aby kontynuować</p>
            <Button asChild>
              <Link href="/sklep">Przejdź do sklepu</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If user is not logged in and hasn't chosen checkout mode yet
  if (status !== "loading" && status !== "authenticated" && !checkoutMode) {
    return (
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-bold mb-6">Kasa</h1>

        <Card className="p-6 space-y-6">
          <div className="space-y-4 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Wybierz sposób zakupu</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => setCheckoutMode("login")}
                size="lg"
                className="flex items-center gap-2 h-20"
              >
                <LogIn className="w-5 h-5" />
                <div>
                  <div className="font-medium">Zaloguj się</div>
                  <div className="text-xs">Kontynuuj jako użytkownik</div>
                </div>
              </Button>

              <Button
                onClick={() => setCheckoutMode("guest")}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 h-20"
              >
                <User className="w-5 h-5" />
                <div>
                  <div className="font-medium">Kup jako gość</div>
                  <div className="text-xs">Bez zakładania konta</div>
                </div>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // If user chose to login
  if (checkoutMode === "login" && status !== "authenticated") {
    return (
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-bold mb-6">Kasa</h1>

        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Zaloguj się aby kontynuować</h2>
            <p className="text-muted-foreground">Zaloguj się lub załóż konto</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/zaloguj">Zaloguj się</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/rejestracja">Zarejestruj się</Link>
            </Button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setCheckoutMode("guest")}
              className="text-primary hover:underline text-sm"
            >
              Kontynuuj jako gość
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Main checkout form (for logged in users or guest mode)
  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-6">Kasa</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Dane osobowe</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Imię</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Telefon</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Adres dostawy</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Ulica i numer</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Miasto</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Kod pocztowy</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Kraj</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Metoda płatności</h2>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem id="bank-transfer" value="BANK_TRANSFER" />
                    <Label
                      htmlFor="bank-transfer"
                      className="flex items-center gap-2 font-normal w-full cursor-pointer"
                    >
                      <BanknoteIcon className="h-5 w-5" />
                      <div className="grid gap-0.5">
                        <span className="font-medium">Przelew bankowy</span>
                        <span className="text-muted-foreground text-sm">
                          Dane do przelewu otrzymasz po złożeniu zamówienia
                        </span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem id="credit-card" value="STRIPE" />
                    <Label
                      htmlFor="credit-card"
                      className="flex items-center gap-2 font-normal w-full cursor-pointer"
                    >
                      <CreditCard className="h-5 w-5" />
                      <div className="grid gap-0.5">
                        <span className="font-medium">Karta płatnicza</span>
                        <span className="text-muted-foreground text-sm">
                          Zapłać kartą kredytową lub debetową
                        </span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Przetwarzanie...
                  </>
                ) : (
                  "Złóż zamówienie"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 space-y-4 sticky top-6">
            <h2 className="text-xl font-semibold mb-2">Podsumowanie zamówienia</h2>

            <div className="space-y-3 divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    <Image
                      src={item.imagePath}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-medium">{formatPLN(item.priceInCents * item.quantity)}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-accent"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suma częściowa</span>
                <span>{formatPLN(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Podatek (23% VAT)</span>
                <span>{formatPLN(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dostawa</span>
                <span>{shipping === 0 ? "Za darmo" : formatPLN(shipping)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2">
                <span>Razem</span>
                <span>{formatPLN(total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
