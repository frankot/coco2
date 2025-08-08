import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Eye, Truck, Package, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// View order details
export function ViewOrderDropdownItem({ id }: { id: string }) {
  return (
    <Link href={`/admin/zamowienia/${id}`}>
      <DropdownMenuItem className="cursor-pointer">
        <Eye className="mr-2 h-4 w-4" />
        <span>Szczegóły zamówienia</span>
      </DropdownMenuItem>
    </Link>
  );
}

// Order status update
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export function UpdateStatusDropdownItem({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: OrderStatus;
}) {
  const updateStatus = async (newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Status zamówienia został zmieniony na ${newStatus}`);
        // Refresh page to show updated status
        window.location.reload();
      } else {
        toast.error("Nie udało się zaktualizować statusu zamówienia");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas aktualizacji statusu");
      console.error(error);
    }
  };

  // Show different status update options based on current status
  switch (currentStatus) {
    case "PENDING":
      return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("PROCESSING")}>
          <Package className="mr-2 h-4 w-4" />
          <span>Rozpocznij realizację</span>
        </DropdownMenuItem>
      );

    case "PROCESSING":
      return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("SHIPPED")}>
          <Truck className="mr-2 h-4 w-4" />
          <span>Oznacz jako wysłane</span>
        </DropdownMenuItem>
      );

    case "SHIPPED":
      return (
        <DropdownMenuItem className="cursor-pointer" onClick={() => updateStatus("DELIVERED")}>
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Oznacz jako dostarczone</span>
        </DropdownMenuItem>
      );

    default:
      return null;
  }
}

// Cancel order
export function CancelOrderDropdownItem({
  id,
  disabled = false,
}: {
  id: string;
  disabled?: boolean;
}) {
  const cancelOrder = async () => {
    if (disabled) return;

    if (!confirm("Czy na pewno chcesz anulować to zamówienie?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (response.ok) {
        toast.success("Zamówienie zostało anulowane");
        // Refresh page to show updated status
        window.location.reload();
      } else {
        toast.error("Nie udało się anulować zamówienia");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas anulowania zamówienia");
      console.error(error);
    }
  };

  return (
    <DropdownMenuItem
      className={`${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer text-destructive"
      }`}
      onClick={cancelOrder}
      disabled={disabled}
    >
      <XCircle className="mr-2 h-4 w-4" />
      <span>Anuluj zamówienie</span>
    </DropdownMenuItem>
  );
}
