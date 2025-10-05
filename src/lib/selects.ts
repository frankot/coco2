export const PRODUCT_LIST_SELECT = {
  id: true,
  name: true,
  price: true,
  isAvailable: true,
  _count: { select: { orderItems: true } },
};

export const CLIENT_LIST_SELECT = {
  id: true,
  email: true,
  accountType: true,
  createdAt: true,
  orders: {
    select: {
      id: true,
      pricePaidInCents: true,
      status: true,
      createdAt: true,
    },
  },
  _count: { select: { orders: true } },
};

export const ORDER_LIST_SELECT = {
  id: true,
  pricePaidInCents: true,
  createdAt: true,
  status: true,
  user: { select: { id: true, email: true, accountType: true } },
  orderItems: {
    select: {
      quantity: true,
      pricePerItemInCents: true,
      product: { select: { name: true } },
    },
  },
  _count: { select: { orderItems: true } },
};

export const ORDER_DETAIL_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      accountType: true,
    },
  },
  billingAddress: true,
  shippingAddress: true,
  orderItems: { include: { product: true } },
};
