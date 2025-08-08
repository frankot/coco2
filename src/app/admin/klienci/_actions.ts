"use server";

import { updateAllUsersAccountType } from "./update-account-types";

export async function updateAllClientsAccountType() {
  return await updateAllUsersAccountType();
}
