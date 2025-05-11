import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/db";
import { formatPLN, formatNumber } from "@/lib/formatter";

async function getSalesData() {
  const sales = await prisma.order.aggregate({
    _sum: {
      pricePaidInCents: true,
    },
    _count: true,
  });

  return {
    amount: sales._sum.pricePaidInCents ?? 0,
    numberOfSales: sales._count,
  };
}

async function getProductData() {
  const [availableProducts, unavailableProducts] = await Promise.all([
    prisma.product.count({
      where: {
        isAvailable: true,
      },
    }),
    prisma.product.count({
      where: {
        isAvailable: false,
      },
    }),
  ]);

  return {
    available: availableProducts,
    unavailable: unavailableProducts,
  };
}

export default async function AdminPage() {
  const [salesData, productData] = await Promise.all([getSalesData(), getProductData()]);

  const totalProducts = productData.available + productData.unavailable;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} orders`}
        body={formatPLN(salesData.amount)}
      />
      <DashboardCard
        title="Products"
        subtitle={`${formatNumber(totalProducts)} total`}
        body={
          <>
            <div className="flex justify-between">
              <span>Available:</span>
              <span className="font-medium">
                {formatNumber(productData.available)} (
                {Math.round((productData.available / (totalProducts || 1)) * 100)}
                %)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Unavailable:</span>
              <span className="font-medium">
                {formatNumber(productData.unavailable)} (
                {Math.round((productData.unavailable / (totalProducts || 1)) * 100)}
                %)
              </span>
            </div>
          </>
        }
      />
    </div>
  );
}

function DashboardCard({
  title,
  subtitle,
  body,
}: {
  title: string;
  subtitle: number | string;
  body: number | string | null | React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle?.toString()}</CardDescription>
      </CardHeader>
      <CardContent>{typeof body === "object" ? body : body?.toString()}</CardContent>
    </Card>
  );
}
