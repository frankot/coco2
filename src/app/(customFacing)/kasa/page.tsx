"use client";

import { useState, useEffect, useRef } from "react";
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
import { ApaczkaService } from "@/types/apaczka";

// Import cart item type from Cart component
type CartItem = {
  id: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imagePath: string;
};

// Payment method type to match schema
type PaymentMethod = "COD" | "STRIPE";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "login" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ApaczkaService[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  // Apaczka pickup point selection (for door-to-point services)
  const [selectedPointId, setSelectedPointId] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedPointType, setSelectedPointType] = useState("");
  const pointInputRef = useRef<HTMLInputElement | null>(null);
  const supplierInputRef = useRef<HTMLInputElement | null>(null);
  const apaczkaMapRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ")[1] || "",
    phoneNumber: "",
    email: session?.user?.email || "",
    street: "",
    city: "",
    postalCode: "",
    country: "Polska",
    paymentMethod: "COD" as PaymentMethod,
    shippingMethodId: "",
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

  // Load Apaczka map widget for pickup points
  useEffect(() => {
    // Only needed if user can choose a door-to-point method
    const hasDoorToPoint = shippingMethods.some((s) => s.door_to_point === "1");
    if (!hasDoorToPoint) return;

    const scriptId = "apaczka-map-js";
    if (document.getElementById(scriptId)) {
      // already loaded; initialize combobox if inputs exist
      try {
        // @ts-ignore
        const ApaczkaMap = (window as any).ApaczkaMap;
        if (ApaczkaMap && !apaczkaMapRef.current) {
          apaczkaMapRef.current = new ApaczkaMap({
            app_id: process.env.NEXT_PUBLIC_APACZKA_MAP_APP_ID || "",
            onChange: (record: any) => {
              if (!record) return;
              const id = record.foreign_access_point_id || "";
              const supplier = record.supplier || "";
              const ptype =
                record.access_point_type ||
                record.point_type ||
                record.type ||
                record.points_type ||
                "";
              setSelectedPointId(id);
              setSelectedSupplier(supplier);
              setSelectedPointType(ptype);
              if (pointInputRef.current) pointInputRef.current.value = id;
              if (supplierInputRef.current) supplierInputRef.current.value = supplier;
            },
          });
        }
        if (apaczkaMapRef.current && pointInputRef.current) {
          try {
            apaczkaMapRef.current.combobox({
              point_id: pointInputRef.current.id,
              supplier_id: supplierInputRef.current?.id,
              placeholder: "Wybierz punkt dostawy...",
            });
          } catch (e) {
            console.warn("Apaczka combobox init failed", e);
          }
        }
      } catch (e) {
        console.warn("Apaczka map init error", e);
      }
      return;
    }
    const s = document.createElement("script");
    s.id = scriptId;
    s.src = "https://mapa.apaczka.pl/client/apaczka.map.js";
    s.async = true;
    s.onload = () => {
      try {
        // @ts-ignore
        const ApaczkaMap = (window as any).ApaczkaMap;
        if (!ApaczkaMap) return;
        apaczkaMapRef.current = new ApaczkaMap({
          app_id: process.env.NEXT_PUBLIC_APACZKA_MAP_APP_ID || "",
          onChange: (record: any) => {
            if (!record) return;
            const id = record.foreign_access_point_id || "";
            const supplier = record.supplier || "";
            const ptype =
              record.access_point_type ||
              record.point_type ||
              record.type ||
              record.points_type ||
              "";
            setSelectedPointId(id);
            setSelectedSupplier(supplier);
            setSelectedPointType(ptype);
            if (pointInputRef.current) pointInputRef.current.value = id;
            if (supplierInputRef.current) supplierInputRef.current.value = supplier;
          },
        });
        // Restrict suppliers on the map widget to match our allowed suppliers
        try {
          apaczkaMapRef.current.setFilterSupplierAllowed(
            ["DHL_PARCEL", "DPD", "INPOST"],
            ["DPD", "INPOST"]
          );
        } catch (e) {
          // Some widget versions may not support setFilterSupplierAllowed
          console.warn("Could not set supplier filter on Apaczka map", e);
        }
        if (pointInputRef.current) {
          // Try to attach combobox to hidden inputs for backwards compatibility
          try {
            apaczkaMapRef.current.combobox({
              point_id: pointInputRef.current.id,
              supplier_id: supplierInputRef.current?.id,
              placeholder: "Wybierz punkt dostawy...",
            });
          } catch (e) {
            console.warn("Apaczka combobox not available", e);
          }
        }

        // If there is an embedded container, try to render the map inline into it.
        try {
          const container = document.getElementById("apaczka-map-container");
          if (container && apaczkaMapRef.current) {
            // Some widget versions support show({ target: element }) or show({ target: 'elementId' })
            // We'll try both patterns and fallback to default show() which opens a modal.
            try {
              apaczkaMapRef.current.show({
                target: container,
                address: {
                  street:
                    (document.getElementById("street") as HTMLInputElement)?.value ||
                    formData.street,
                  city:
                    (document.getElementById("city") as HTMLInputElement)?.value || formData.city,
                },
              });
            } catch (err) {
              try {
                // Try passing element id
                apaczkaMapRef.current.show({
                  target: "apaczka-map-container",
                  address: { street: formData.street, city: formData.city },
                });
              } catch (err2) {
                // Final fallback: open modal map
                apaczkaMapRef.current.show({
                  address: { street: formData.street, city: formData.city },
                });
              }
            }
          }
        } catch (e) {
          console.warn("Could not render apaczka map in container", e);
        }
      } catch (e) {
        console.warn("Apaczka map onload error", e);
      }
    };
    document.body.appendChild(s);
  }, [shippingMethods]);

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

  // If logged in, fetch profile to prefill default address
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) return;
        const data = await res.json();
        const def = (data.addresses || []).find((a: any) => a.isDefault);
        if (def) {
          setFormData((prev) => ({
            ...prev,
            street: def.street || prev.street,
            city: def.city || prev.city,
            postalCode: def.postalCode || prev.postalCode,
            country: def.country || prev.country,
            phoneNumber: def.phoneNumber || prev.phoneNumber,
          }));
        }
      } catch (e) {
        // ignore
      }
    };

    if (session?.user) fetchProfile();
  }, [session]);

  // Fetch shipping methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsLoadingShipping(true);
      setShippingError(null);
      try {
        const response = await fetch("/api/shipping/apaczka");
        const data = await response.json();

        console.log("Shipping methods response:", data);

        if (data.status === 200 && data.response?.services) {
          setShippingMethods(data.response.services);
          // Select first shipping method by default if available
          if (data.response.services.length > 0) {
            setSelectedShippingMethod(data.response.services[0].service_id);
            setFormData((prev) => ({
              ...prev,
              shippingMethodId: data.response.services[0].service_id,
            }));
          }
        } else {
          setShippingError(
            data.message ||
              "Nie udało się pobrać metod dostawy. Spróbuj ponownie później lub skontaktuj się z obsługą."
          );
          console.error("Shipping methods error:", data);
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        setShippingError(
          "Wystąpił błąd podczas pobierania metod dostawy. Spróbuj ponownie później lub skontaktuj się z obsługą."
        );
      } finally {
        setIsLoadingShipping(false);
      }
    };

    fetchShippingMethods();
  }, []);

  // Compute visible services depending on selected payment method
  const visibleServices = (() => {
    const allowedSuppliers = ["DPD", "INPOST", "DHL"];
    // Keep only allowed suppliers from the fetched list
    const allowed = shippingMethods.filter((s) => allowedSuppliers.includes(s.supplier));

    // Helper selectors
    const preferName = (s: ApaczkaService, names: string[]) =>
      names.some((n) => s.name.toLowerCase() === n.toLowerCase());
    const badName = (s: ApaczkaService) => {
      const n = s.name.toLowerCase();
      return (
        n.includes("allegro") ||
        n.includes("smart") ||
        n.includes("europa") ||
        n.includes("max") ||
        /\bdo\s*\d{1,2}:\d{2}/.test(n) // time-window services
      );
    };
    const pickCanonical = (
      supplier: string,
      list: ApaczkaService[],
      predicate: (s: ApaczkaService) => boolean,
      preferredNames: string[]
    ) => {
      const pool = list.filter((s) => s.supplier === supplier && predicate(s) && !badName(s));
      if (pool.length === 0) return undefined;
      const exact = pool.find((s) => preferName(s, preferredNames));
      if (exact) return exact;
      // fallback: pick the shortest name as the most generic
      return pool.sort((a, b) => a.name.length - b.name.length)[0];
    };

    // If a supplier doesn't have an exact door_to_door match, fallback to any available non-bad service
    const pickAnyFallback = (supplier: string) => {
      const pool = allowed.filter((s) => s.supplier === supplier && !badName(s));
      if (pool.length === 0) return undefined;
      return pool.sort((a, b) => a.name.length - b.name.length)[0];
    };

    const suppliers = ["DPD", "INPOST", "DHL"] as const;

    if (formData.paymentMethod === "COD") {
      // Exactly 3 door-to-door: create a synthetic 'Pobranie' entry per supplier
      const picks = suppliers
        .map((sup) =>
          pickCanonical(
            sup,
            allowed,
            (s) => s.door_to_door === "1",
            sup === "DPD"
              ? ["DPD Kurier"]
              : sup === "INPOST"
                ? ["InPost Kurier"]
                : ["DHL Parcel Kurier", "DHL Kurier"]
          )
        )
        .filter(Boolean) as ApaczkaService[];
      // Map to synthetic COD-only entries
      return picks.map(
        (d) =>
          ({
            service_id: `${d.service_id}_COD`,
            name: `${d.name} - Pobranie`,
            supplier: d.supplier,
            delivery_time: d.delivery_time,
            door_to_door: d.door_to_door,
            door_to_point: d.door_to_point,
            point_to_point: d.point_to_point,
            // underlying id for API calls
            underlying_service_id: d.service_id,
          }) as any as ApaczkaService
      );
    }

    // STRIPE: 3 door-to-door + 3 door-to-point + 1 point-to-point (e.g., Paczkomaty)
    const d2d = suppliers
      .map((sup) =>
        pickCanonical(
          sup,
          allowed,
          (s) => s.door_to_door === "1",
          sup === "DPD"
            ? ["DPD Kurier"]
            : sup === "INPOST"
              ? ["InPost Kurier"]
              : ["DHL Parcel Kurier", "DHL Kurier"]
        )
      )
      .filter(Boolean) as ApaczkaService[];

    const d2p = suppliers
      .map((sup) =>
        pickCanonical(
          sup,
          allowed,
          (s) => s.door_to_point === "1",
          sup === "DPD"
            ? ["DPD Pickup", "DPD Punkt"]
            : sup === "INPOST"
              ? ["InPost Punkt Odbioru"]
              : ["DHL Parcelshop", "DHL Punkt"]
        )
      )
      .filter(Boolean) as ApaczkaService[];

    // One point-to-point, prefer INPOST Paczkomaty
    const p2pPreferred = pickCanonical("INPOST", allowed, (s) => s.point_to_point === "1", [
      "InPost Paczkomaty",
      "Paczkomaty",
    ]);
    const p2pFallback = suppliers
      .map((sup) => pickCanonical(sup, allowed, (s) => s.point_to_point === "1", []))
      .find(Boolean);
    const p2p = p2pPreferred || p2pFallback;

    // For STRIPE construct synthetic entries: for each supplier create a prepaid row only (card)
    const result: ApaczkaService[] = [];
    suppliers.forEach((sup) => {
      const d = pickCanonical(
        sup,
        allowed,
        (s) => s.door_to_door === "1",
        sup === "DPD"
          ? ["DPD Kurier"]
          : sup === "INPOST"
            ? ["InPost Kurier"]
            : ["DHL Parcel Kurier", "DHL Kurier"]
      );
      if (d) {
        // Prepaid (card) row only
        result.push({
          service_id: `${d.service_id}_PREPAID`,
          name: `${d.name}`,
          supplier: d.supplier,
          delivery_time: d.delivery_time,
          door_to_door: d.door_to_door,
          door_to_point: d.door_to_point,
          point_to_point: d.point_to_point,
          underlying_service_id: d.service_id,
        } as any as ApaczkaService);
      }
    });

    // Do not add per-supplier door-to-point entries. Instead expose a single generic
    // 'Dostawa do punktu' option that opens the Apaczka map. The map will return
    // both supplier and point id which we persist on the order.
    if (p2p || d2p.length > 0) {
      const synthetic: any = {
        service_id: "APACZKA_MAP",
        name: "Dostawa do punktu",
        supplier: "APACZKA_MAP",
        delivery_time: "",
        underlying_service_id: null,
      };
      result.push(synthetic as ApaczkaService);
    }

    return result;
  })();

  // Set default selection when visibleServices change
  useEffect(() => {
    if (!selectedShippingMethod && visibleServices.length > 0) {
      setSelectedShippingMethod(visibleServices[0].service_id);
      setFormData((prev) => ({ ...prev, shippingMethodId: visibleServices[0].service_id }));
    }
  }, [visibleServices, selectedShippingMethod, setFormData]);

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

    // If door-to-point selected, ensure a point is chosen
    const selected = shippingMethods.find((m) => m.service_id === selectedShippingMethod);
    const requiresPoint = selected?.door_to_point === "1";
    if (requiresPoint && !selectedPointId) {
      setError("Dla dostawy DPD punkt wymagany jest wybór punktu odbioru");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Resolve synthetic service ids to real Apaczka service ids
      let resolvedServiceId = formData.shippingMethodId;
      // If synthetic (ends with _COD, _PREPAID, _D2P) strip suffix and find underlying id
      if (resolvedServiceId && resolvedServiceId.endsWith("_COD")) {
        resolvedServiceId = resolvedServiceId.replace(/_COD$/, "");
      } else if (resolvedServiceId && resolvedServiceId.endsWith("_PREPAID")) {
        resolvedServiceId = resolvedServiceId.replace(/_PREPAID$/, "");
      } else if (resolvedServiceId && resolvedServiceId.endsWith("_D2P")) {
        resolvedServiceId = resolvedServiceId.replace(/_D2P$/, "");
      }

      // If user picked the generic APACZKA_MAP option, resolve by selectedSupplier
      if (formData.shippingMethodId === "APACZKA_MAP") {
        if (!selectedSupplier) {
          setError("Wybierz dostawcę punktu na mapie");
          setIsSubmitting(false);
          return;
        }
        // find a door_to_point service for that supplier with basic type heuristics
        const candidates = shippingMethods.filter(
          (s) => s.supplier === selectedSupplier && s.door_to_point === "1"
        );
        let match = candidates[0];
        if (selectedSupplier.toUpperCase() === "INPOST" && candidates.length > 1) {
          if (selectedPointId?.startsWith("POP-")) {
            match =
              candidates.find((s) => /punkt/i.test(s.name)) ||
              candidates.find((s) => /parcelshop|pickup/i.test(s.name)) ||
              match;
          } else {
            match =
              candidates.find((s) => /paczkomat/i.test(s.name) || /paczkomaty/i.test(s.name)) ||
              match;
          }
        }
        if (!match) {
          setError("Nie znaleziono usługi punktowej dla wybranego przewoźnika");
          setIsSubmitting(false);
          return;
        }
        resolvedServiceId = match.service_id;
      }

      // If the selected (resolved) service supports door_to_point, ensure a point is selected
      const serviceMeta = shippingMethods.find((s) => s.service_id === resolvedServiceId);
      if (serviceMeta?.door_to_point === "1" && !selectedPointId) {
        setError("Wybierz punkt odbioru dla tej metody dostawy");
        setIsSubmitting(false);
        return;
      }

      // Prepare order data
      const orderData = {
        ...formData,
        cartItems,
        userId: session?.user?.id,
        // supply the resolved numeric service id for server-side processing
        shippingMethodId: resolvedServiceId,
        apaczkaPointId: selectedPointId || undefined,
        apaczkaPointSupplier: selectedSupplier || undefined,
      };

      // Submit order to server action
      const result = await createOrder(orderData);

      if (result.success) {
        if (formData.paymentMethod === "STRIPE") {
          // Create Stripe checkout session
          const response = await fetch("/api/payments/stripe/create-checkout-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: result.orderId,
              items: cartItems,
              totalAmount: total,
              email: formData.email,
            }),
          });

          const { url } = await response.json();

          if (url) {
            // Clear cart
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartUpdated"));

            // Redirect to Stripe Checkout
            window.location.href = url;
            return;
          }
        } else {
          // Clear cart after successful order
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));

          // Redirect to order confirmation page
          router.push(
            `/kasa/zlozone-zamowienie?orderId=${result.orderId}&payment=${formData.paymentMethod}`
          );
        }
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

  // Calculate shipping cost based on selected method
  const getShippingCost = () => {
    // For now, return a fixed cost. In a real implementation, you would calculate this based on the selected method
    return selectedShippingMethod ? 1500 : 0; // 15 PLN in cents
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0);
  const shipping = getShippingCost();
  const total = subtotal + shipping;

  // Check if cart is empty
  if (isClient && cartItems.length === 0) {
    return (
      <div className="container max-w-3xl py-10 px-4 md:px-6">
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
      <div className="container max-w-3xl py-10 px-4 md:px-6">
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
      <div className="container max-w-3xl py-10 px-4 md:px-6">
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
    <div className="container max-w-6xl py-10 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Kasa</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Dane osobowe</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {/* phone moved to shipping address section */}
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Adres dostawy</h2>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Card className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Metoda płatności</h2>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem id="cod" value="COD" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-2 font-normal w-full cursor-pointer"
                    >
                      <BanknoteIcon className="h-5 w-5" />
                      <div className="grid gap-0.5">
                        <span className="font-medium">Pobranie (COD)</span>
                        <span className="text-muted-foreground text-sm">
                          Zapłać kurierowi przy odbiorze
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

              {/* Shipping Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Metoda dostawy</h3>
                {isLoadingShipping ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : shippingError ? (
                  <div className="text-red-500">{shippingError}</div>
                ) : (
                  <RadioGroup
                    value={selectedShippingMethod || ""}
                    onValueChange={(value) => {
                      setSelectedShippingMethod(value);
                      setFormData((prev) => ({
                        ...prev,
                        shippingMethodId: value,
                      }));
                      // Reset point selection when method changes
                      setSelectedPointId("");
                      setSelectedSupplier("");

                      // If user selected the generic 'Dostawa do punktu', open the Apaczka map immediately
                      if (value === "APACZKA_MAP") {
                        try {
                          apaczkaMapRef.current?.setFilterSupplierAllowed?.(["DPD", "INPOST"]);
                          apaczkaMapRef.current?.show?.({
                            address: { street: formData.street, city: formData.city },
                          });
                        } catch (e) {
                          console.warn("Could not open Apaczka map on selection", e);
                        }
                      }
                    }}
                  >
                    {visibleServices.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Brak dostępnych metod dostawy dla wybranej metody płatności
                      </div>
                    ) : (
                      visibleServices.map((method) => {
                        const isDoorToPoint =
                          method.door_to_point === "1" || method.service_id === "APACZKA_MAP";
                        const isActive = selectedShippingMethod === method.service_id;
                        const label =
                          method.service_id === "APACZKA_MAP" ? method.name : method.name;
                        return (
                          <div
                            key={method.service_id}
                            className="flex flex-col gap-2 border rounded-md p-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={method.service_id}
                                id={`shipping-${method.service_id}`}
                              />
                              <Label htmlFor={`shipping-${method.service_id}`}>
                                {label} {method.delivery_time ? ` - ${method.delivery_time}` : ""}
                              </Label>
                            </div>
                            {isDoorToPoint && isActive && (
                              <div className="pl-7 mt-2 space-y-2">
                                <div className="text-sm text-muted-foreground">
                                  Wybierz punkt dostawy na mapie poniżej.
                                </div>

                                {/* Show a simple button that opens the Apaczka map modal. The widget will update
                                    the hidden inputs `apaczka_point_id` and `apaczka_supplier` when a point is selected. */}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        try {
                                          setSelectedShippingMethod("APACZKA_MAP");
                                          setFormData((prev) => ({
                                            ...prev,
                                            shippingMethodId: "APACZKA_MAP",
                                          }));
                                          apaczkaMapRef.current?.setFilterSupplierAllowed?.([
                                            "DHL_PARCEL",
                                            "DPD",
                                            "INPOST",
                                          ]);
                                          // open the map modal centered on address
                                          apaczkaMapRef.current?.show?.({
                                            address: {
                                              street: formData.street,
                                              city: formData.city,
                                            },
                                          });
                                        } catch (e) {
                                          console.warn("Could not open Apaczka map", e);
                                        }
                                      }}
                                    >
                                      Wybierz punkt na mapie
                                    </Button>
                                  </div>

                                  {/* Hidden inputs for widget to write selection into */}
                                  <input id="apaczka_point_id" ref={pointInputRef} type="hidden" />
                                  <input
                                    id="apaczka_supplier"
                                    ref={supplierInputRef}
                                    type="hidden"
                                  />
                                  <input
                                    id="apaczka_point_type"
                                    type="hidden"
                                    value={selectedPointType}
                                    readOnly
                                  />
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  {selectedPointId ? (
                                    <>
                                      Wybrany punkt: {selectedPointId}{" "}
                                      {selectedSupplier && `( ${selectedSupplier} )`}
                                    </>
                                  ) : (
                                    <span className="text-red-500">
                                      Wybór punktu jest wymagany dla tej metody
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </RadioGroup>
                )}
              </div>

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
        <div className="order-1 lg:order-2">
          <Card className="p-4 md:p-6 space-y-4 lg:sticky lg:top-20">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Podsumowanie zamówienia</h2>

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
                <span className="text-muted-foreground">Dostawa</span>
                <span>{formatPLN(shipping)}</span>
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
