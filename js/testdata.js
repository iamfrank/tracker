import { addObservation } from "./db.js"

function zeroPrefix(n) {
  if (n < 10) {
    return `0${n}`
  } else {
    return n
  }
}

for (let m = 12; m > 0; m--) {
  for (let d = 28; d > 0; d--) {
    addObservation({
      day: `2023-${zeroPrefix(m)}-${zeroPrefix(d)}`,
      mood: Math.floor(Math.random() * 4) + 1,
    })
  }
}
