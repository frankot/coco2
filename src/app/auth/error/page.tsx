"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "unknown";

  const errorMessages: Record<string, string> = {
    AccessDenied: "You don't have permission to access this page.",
    CredentialsSignin: "Invalid username or password.",
    SessionRequired: "You must be signed in to access this page.",
    default: "An authentication error occurred.",
  };

  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Authentication Error
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-center mb-6">{errorMessage}</p>

          <div className="flex justify-center">
            <Button asChild>
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
