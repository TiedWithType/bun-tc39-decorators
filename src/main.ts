import { DEBUG, debugReports } from "./debug";

@DEBUG
class Counter {
  @DEBUG count = 2;
  @DEBUG accessor score = 5;

  @DEBUG
  increment(): number {
    return ++this.count;
  }
}

const counter = new Counter();
const countBefore = counter.count;
const scoreBefore = counter.score;
const incrementResult = counter.increment();
counter.score = 9;

const runtimeChecks = [
  { label: "Pole zachowało wartość początkową 2", ok: countBefore === 2 },
  { label: "Metoda increment() zwraca 3 i zachowuje this", ok: incrementResult === 3 && counter.count === 3 },
  { label: "Accessor odczytuje 5 i przyjmuje nową wartość 9", ok: scoreBefore === 5 && counter.score === 9 },
  { label: "Wywołano DEBUG dla wszystkich czterech elementów", ok: debugReports.length === 4 && ["class", "field", "method", "accessor"].every(kind => debugReports.some(report => report.kind === kind)) },
];

const passed = debugReports.every(report => report.checks.every(check => check.ok)) && runtimeChecks.every(check => check.ok);
const message = [
  passed ? "DEBUG: WSZYSTKIE SPRAWDZENIA OK" : "DEBUG: WYKRYTO BŁĄD",
  "",
  ...debugReports.flatMap(report => [
    `@DEBUG ${report.name}: value=${report.valueType}`,
    report.contextSummary,
    ...report.checks.map(check => `${check.ok ? "OK" : "BŁĄD"}: ${check.label}`),
    "",
  ]),
  "Sprawdzenia po utworzeniu instancji:",
  ...runtimeChecks.map(check => `${check.ok ? "OK" : "BŁĄD"}: ${check.label}`),
].join("\n");

const status = document.querySelector<HTMLElement>("#status")!;
status.textContent = passed ? "Wszystkie sprawdzenia OK" : "Wykryto błąd";
status.dataset.result = passed ? "pass" : "fail";
document.querySelector<HTMLElement>("#report")!.textContent = message;
document.querySelector<HTMLButtonElement>("#show-alert")!.addEventListener("click", () => alert(message));
alert(message);
