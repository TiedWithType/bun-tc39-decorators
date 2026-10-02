export interface DebugReport {
  kind: string;
  name: string;
  valueType: string;
  checks: { label: string; ok: boolean }[];
  contextSummary: string;
}

export const debugReports: DebugReport[] = [];

/** TC39: obserwuje i sprawdza argumenty, bez zmiany dekorowanego elementu. */
export function DEBUG(value: unknown, context: DecoratorContext): void {
  const kind = context.kind;
  const checks = [
    { label: "context jest obiektem", ok: typeof context === "object" && context !== null },
    { label: "context.name jest stringiem lub symbolem", ok: typeof context.name === "string" || typeof context.name === "symbol" },
    { label: "context.addInitializer jest funkcją", ok: typeof context.addInitializer === "function" },
    { label: "context.metadata jest obiektem", ok: typeof context.metadata === "object" && context.metadata !== null },
  ];

  if (kind === "field") {
    checks.push({ label: "value pola jest undefined", ok: value === undefined });
  } else if (kind === "accessor") {
    const accessor = value as { get?: unknown; set?: unknown } | null;
    checks.push({
      label: "value accessora zawiera funkcje get i set",
      ok: typeof accessor === "object" && accessor !== null && typeof accessor.get === "function" && typeof accessor.set === "function",
    });
  } else {
    checks.push({ label: `value dla ${kind} jest funkcją`, ok: typeof value === "function" });
  }

  let contextSummary = `kind=${kind}, name=${String(context.name)}`;
  if (kind !== "class") {
    checks.push(
      { label: "context.static jest booleanem", ok: typeof context.static === "boolean" },
      { label: "context.private jest booleanem", ok: typeof context.private === "boolean" },
      { label: "context.access.has jest funkcją", ok: typeof context.access?.has === "function" },
    );
    if (kind !== "setter") {
      checks.push({ label: "context.access.get jest funkcją", ok: "get" in context.access && typeof context.access.get === "function" });
    }
    if (kind === "field" || kind === "accessor" || kind === "setter") {
      checks.push({ label: "context.access.set jest funkcją", ok: "set" in context.access && typeof context.access.set === "function" });
    }
    contextSummary += `, static=${context.static}, private=${context.private}`;
  }

  const report: DebugReport = {
    kind,
    name: String(context.name),
    valueType: value === undefined ? "undefined" : typeof value,
    checks,
    contextSummary,
  };
  debugReports.push(report);
  console.log("@DEBUG", { value, context, report });
}
