type Ctx = Record<string, unknown> | undefined;

function shape(scope: string, err: unknown, ctx?: Ctx) {
  const e = err as { message?: string; name?: string; code?: string; stack?: string } | undefined;
  return {
    scope,
    name: e?.name,
    code: e?.code,
    message: e?.message ?? String(err),
    ...(process.env.NODE_ENV === "production" ? {} : { stack: e?.stack }),
    ...(ctx ? { ctx } : {}),
  };
}

export function logError(scope: string, err: unknown, ctx?: Ctx) {
  console.error(JSON.stringify(shape(scope, err, ctx)));
}

export function logWarn(scope: string, msg: string, ctx?: Ctx) {
  console.warn(JSON.stringify({ scope, message: msg, ...(ctx ? { ctx } : {}) }));
}

export function logInfo(scope: string, msg: string, ctx?: Ctx) {
  console.info(JSON.stringify({ scope, message: msg, ...(ctx ? { ctx } : {}) }));
}
