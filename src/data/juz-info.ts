export interface JuzMapping {
  id: number;
  startSura: number;
  startAyah: number;
  endSura: number;
  endAyah: number;
}

export const juzNames: Record<number, string> = {
  1: "Елиф Лам Мим",
  2: "Сејекулу",
  3: "Тилкер-Русул",
  // Можеш да додадеш имиња за сите подоцна
};

export const juzMap: Record<number, JuzMapping> = {
  1: { id: 1, startSura: 1, startAyah: 1, endSura: 2, endAyah: 141 },
  2: { id: 2, startSura: 2, startAyah: 142, endSura: 2, endAyah: 252 },
  3: { id: 3, startSura: 2, startAyah: 253, endSura: 3, endAyah: 92 },
  4: { id: 4, startSura: 3, startAyah: 93, endSura: 4, endAyah: 23 },
  5: { id: 5, startSura: 4, startAyah: 24, endSura: 4, endAyah: 147 },
  6: { id: 6, startSura: 4, startAyah: 148, endSura: 5, endAyah: 81 },
  7: { id: 7, startSura: 5, startAyah: 82, endSura: 6, endAyah: 110 },
  8: { id: 8, startSura: 6, startAyah: 111, endSura: 7, endAyah: 87 },
  9: { id: 9, startSura: 7, startAyah: 88, endSura: 8, endAyah: 40 },
  10: { id: 10, startSura: 8, startAyah: 41, endSura: 9, endAyah: 92 },
  11: { id: 11, startSura: 9, startAyah: 93, endSura: 11, endAyah: 5 },
  12: { id: 12, startSura: 11, startAyah: 6, endSura: 12, endAyah: 52 },
  13: { id: 13, startSura: 12, startAyah: 53, endSura: 14, endAyah: 52 },
  14: { id: 14, startSura: 15, startAyah: 1, endSura: 16, endAyah: 128 },
  15: { id: 15, startSura: 17, startAyah: 1, endSura: 18, endAyah: 74 },
  16: { id: 16, startSura: 18, startAyah: 75, endSura: 20, endAyah: 135 },
  17: { id: 17, startSura: 21, startAyah: 1, endSura: 22, endAyah: 78 },
  18: { id: 18, startSura: 23, startAyah: 1, endSura: 25, endAyah: 20 },
  19: { id: 19, startSura: 25, startAyah: 21, endSura: 27, endAyah: 55 },
  20: { id: 20, startSura: 27, startAyah: 56, endSura: 29, endAyah: 45 },
  21: { id: 21, startSura: 29, startAyah: 46, endSura: 33, endAyah: 30 },
  22: { id: 22, startSura: 33, startAyah: 31, endSura: 36, endAyah: 27 },
  23: { id: 23, startSura: 36, startAyah: 28, endSura: 39, endAyah: 31 },
  24: { id: 24, startSura: 39, startAyah: 32, endSura: 41, endAyah: 46 },
  25: { id: 25, startSura: 41, startAyah: 47, endSura: 45, endAyah: 37 },
  26: { id: 26, startSura: 46, startAyah: 1, endSura: 51, endAyah: 30 },
  27: { id: 27, startSura: 51, startAyah: 31, endSura: 57, endAyah: 29 },
  28: { id: 28, startSura: 58, startAyah: 1, endSura: 66, endAyah: 12 },
  29: { id: 29, startSura: 67, startAyah: 1, endSura: 77, endAyah: 50 },
  30: { id: 30, startSura: 78, startAyah: 1, endSura: 114, endAyah: 6 },
};
