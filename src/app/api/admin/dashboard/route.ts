import { createRouteHandler } from "@/lib/api";
import prisma from "@/db";

const REVENUE_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const GET = createRouteHandler(
  async () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const last14DaysStart = startOfDay(new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000));

    const [
      productsCount,
      usersCount,
      ordersCount,
      pendingOrdersCount,
      paidOrdersCount,
      processingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      activeDiscountCodesCount,
      usedDiscountCodesCount,
      allRevenueAgg,
      monthRevenueAgg,
      ordersByStatus,
      recentOrders,
      latestOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.discountCode.count({ where: { isActive: true } }),
      prisma.discountCode.count({ where: { usedCount: { gt: 0 } } }),
      prisma.order.aggregate({
        where: { status: { in: [...REVENUE_STATUSES] } },
        _sum: { pricePaidInCents: true, discountAmountInCents: true },
      }),
      prisma.order.aggregate({
        where: {
          status: { in: [...REVENUE_STATUSES] },
          createdAt: { gte: monthStart },
        },
        _sum: { pricePaidInCents: true, discountAmountInCents: true },
      }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.order.findMany({
        where: { createdAt: { gte: last14DaysStart } },
        select: { createdAt: true, pricePaidInCents: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          pricePaidInCents: true,
          createdAt: true,
          user: { select: { email: true } },
        },
      }),
    ]);

    const dailyMap: Record<string, { orders: number; revenueInCents: number }> = {};
    for (let i = 0; i < 14; i++) {
      const d = startOfDay(new Date(last14DaysStart.getTime() + i * 24 * 60 * 60 * 1000));
      dailyMap[toDayKey(d)] = { orders: 0, revenueInCents: 0 };
    }

    for (const order of recentOrders) {
      const key = toDayKey(startOfDay(order.createdAt));
      if (!dailyMap[key]) continue;
      dailyMap[key].orders += 1;
      dailyMap[key].revenueInCents += order.pricePaidInCents;
    }

    const ordersLast14Days = Object.entries(dailyMap).map(([date, value]) => ({
      date,
      orders: value.orders,
      revenueInCents: value.revenueInCents,
    }));

    const totalDiscountGrantedInCents = allRevenueAgg._sum.discountAmountInCents ?? 0;

    return {
      productsCount,
      usersCount,
      ordersCount,
      pendingOrdersCount,
      paidOrdersCount,
      processingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      activeDiscountCodesCount,
      usedDiscountCodesCount,
      totalRevenueInCents: allRevenueAgg._sum.pricePaidInCents ?? 0,
      monthRevenueInCents: monthRevenueAgg._sum.pricePaidInCents ?? 0,
      totalDiscountGrantedInCents,
      averageOrderValueInCents:
        ordersCount > 0 ? Math.round((allRevenueAgg._sum.pricePaidInCents ?? 0) / ordersCount) : 0,
      statusDistribution: ordersByStatus.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
      ordersLast14Days,
      latestOrders: latestOrders.map((order) => ({
        id: order.id,
        status: order.status,
        pricePaidInCents: order.pricePaidInCents,
        createdAt: order.createdAt,
        email: order.user.email,
      })),
    };
  },
  { auth: "admin" }
);
