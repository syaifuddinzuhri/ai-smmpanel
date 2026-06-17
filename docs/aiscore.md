# AI Score — Cara Perhitungan

## Formula

```
aiScore = successRate × 0.55
        + max(0, 100 − cancelRate × 15) × 0.30
        + volumeScore × 0.15
```

Hasil dikunci di rentang **0–100**.

---

## Variabel

| Variabel | Rumus | Bobot |
|---|---|---|
| `successRate` | `(completed / total) × 100` | 55% |
| `cancelRate` | `(cancelled / total) × 100` | — (penalti) |
| `volumeScore` | `(order layanan ini / order terbanyak) × 100` | 15% |

---

## Contoh

**Data:** 500 order — 490 completed, 3 cancelled, layanan terpopuler punya 1000 order.

```
successRate = 490/500 × 100 = 98.0
cancelRate  = 3/500   × 100 = 0.6
volumeScore = 500/1000 × 100 = 50.0

aiScore = 98.0 × 0.55                     →  53.90
        + max(0, 100 − 0.6 × 15) × 0.30  →  91 × 0.30 = 27.30
        + 50.0 × 0.15                     →   7.50
        ──────────────────────────────────────────────
        = 88.70  →  dibulatkan  →  89
```

---

## Turunan Score

| Score | Quality | isHot |
|---|---|---|
| ≥ 90 | Premium | `total ≥ maxOrders × 0.7` |
| ≥ 80 | High | — |
| < 80 | Standard | — |

> Cancel rate 7% → penalti jadi `100 − 105 = −5` → diclamp ke `0` → komponen 30% **hilang total**.
