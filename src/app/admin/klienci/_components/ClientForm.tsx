"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { addClient, updateClient } from "../../_actions/clients";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

type User = {
  id: string;
  email: string;
  accountType: "ADMIN" | "DETAL" | "HURT";
};

export default function ClientForm({ client }: { client?: User | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [accountType, setAccountType] = useState<string>(client?.accountType || "DETAL");
  const router = useRouter();

  const initialState = { error: {} };

  const [state, formAction, isPending] = useActionState(
    client
      ? (prevState: any, formData: FormData) => updateClient(client.id, prevState, formData)
      : addClient,
    initialState
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" required defaultValue={client?.email || ""} />
        {state?.error?.email && <div className="text-destructive">{state.error.email}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Hasło {client && "(pozostaw puste, aby nie zmieniać)"}</Label>
        <Input type="password" id="password" name="password" required={!client} minLength={6} />
        {state?.error?.password && <div className="text-destructive">{state.error.password}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Powtórz hasło {client && "(pozostaw puste, aby nie zmieniać)"}
        </Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required={!client}
          minLength={6}
        />
        {state?.error?.confirmPassword && (
          <div className="text-destructive">{state.error.confirmPassword}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Typ konta</Label>
        <RadioGroup
          value={accountType}
          onValueChange={setAccountType}
          name="accountType"
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="DETAL" id="detal" />
            <Label htmlFor="detal">Detal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="HURT" id="hurt" />
            <Label htmlFor="hurt">Hurt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ADMIN" id="admin" />
            <Label htmlFor="admin">Admin</Label>
          </div>
        </RadioGroup>
        {state?.error?.accountType && (
          <div className="text-destructive">{state.error.accountType}</div>
        )}
      </div>

      {state?.error?._form && <div className="text-destructive">{state.error._form}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? client
              ? "Aktualizowanie..."
              : "Dodawanie..."
            : client
              ? "Aktualizuj klienta"
              : "Dodaj klienta"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Wróć
        </Button>
      </div>
    </form>
  );
}
