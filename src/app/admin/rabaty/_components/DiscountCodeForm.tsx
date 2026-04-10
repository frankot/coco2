"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useActionState } from "react";
import { addDiscountCode } from "../../_actions/rabaty";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function DiscountCodeForm() {
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const initialState = { error: {} };

  const [state, formAction, isPending] = useActionState(addDiscountCode, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {/* Code */}
      <div className="space-y-2">
        <Label htmlFor="code">Kod rabatowy</Label>
        <Input
          id="code"
          name="code"
          placeholder="np. LATO2024"
          className="uppercase"
        />
        {state.error?.code && (
          <p className="text-sm text-destructive">{state.error.code[0]}</p>
        )}
      </div>

      {/* Discount Type */}
      <div className="space-y-2">
        <Label>Typ rabatu</Label>
        <RadioGroup
          name="discountType"
          value={discountType}
          onValueChange={(v) => setDiscountType(v as "PERCENTAGE" | "FIXED_AMOUNT")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PERCENTAGE" id="percentage" />
            <Label htmlFor="percentage">Procentowy (%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FIXED_AMOUNT" id="fixed" />
            <Label htmlFor="fixed">Kwotowy (PLN)</Label>
          </div>
        </RadioGroup>
        {state.error?.discountType && (
          <p className="text-sm text-destructive">{state.error.discountType[0]}</p>
        )}
      </div>

      {/* Discount Amount */}
      <div className="space-y-2">
        <Label htmlFor="discountAmount">
          {discountType === "PERCENTAGE" ? "Wartość (%)" : "Wartość (PLN)"}
        </Label>
        {discountType === "PERCENTAGE" ? (
          <RadioGroup name="discountAmount" defaultValue="10">
            {[5, 10, 15, 20, 25, 30, 40, 50].map((v) => (
              <div key={v} className="flex items-center space-x-2">
                <RadioGroupItem value={String(v)} id={`pct-${v}`} />
                <Label htmlFor={`pct-${v}`}>{v}%</Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <Input
            id="discountAmount"
            name="discountAmount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="np. 15.00"
          />
        )}
        {state.error?.discountAmount && (
          <p className="text-sm text-destructive">{state.error.discountAmount[0]}</p>
        )}
      </div>

      {/* Single Use */}
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="isSingleUse" name="isSingleUse" className="h-4 w-4" />
        <Label htmlFor="isSingleUse">Jednorazowy</Label>
      </div>

      {/* Form Error */}
      {state.error?._form && (
        <p className="text-sm text-destructive">{state.error._form[0]}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Tworzenie..." : "Utwórz kod rabatowy"}
      </Button>
    </form>
  );
}
