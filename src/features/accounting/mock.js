export const INVOICES = [
  { id: "INV-1042", client: "Marwan Abdeddaiem", amount: 1240, status: "overdue", date: "2026-08-12" },
  { id: "INV-1041", client: "Sara Ben Ali", amount: 980, status: "pending", date: "2026-09-04" },
  { id: "INV-1040", client: "Mohamed Aziz Malki", amount: 890, status: "paid", date: "2026-09-01" },
  { id: "INV-1038", client: "Office Schengen batch", amount: 4200, status: "paid", date: "2026-08-22" },
];

export const EXPENSES = [
  { id: 1, category: "Translation", amount: 320, note: "FR/EN packs", date: "2026-09-08" },
  { id: 2, category: "Courier", amount: 95, note: "Embassy drop", date: "2026-09-11" },
  { id: 3, category: "Rent", amount: 1800, note: "Agency office", date: "2026-09-01" },
  { id: 4, category: "Software", amount: 140, note: "OCR / hosting", date: "2026-09-03" },
];

export const ACCOUNTS = [
  { id: "tn-biat", name: "BIAT operating", currency: "TND", balance: 42890 },
  { id: "tn-stb", name: "STB reserve", currency: "TND", balance: 15200 },
  { id: "eu-wise", name: "Wise EUR", currency: "EUR", balance: 6100 },
];

export const CASHFLOW = [
  { month: "Apr", income: 14800, spend: 9200 },
  { month: "May", income: 16100, spend: 8800 },
  { month: "Jun", income: 13900, spend: 10100 },
  { month: "Jul", income: 19200, spend: 11400 },
  { month: "Aug", income: 22100, spend: 10900 },
  { month: "Sep", income: 17680, spend: 2355 },
];
