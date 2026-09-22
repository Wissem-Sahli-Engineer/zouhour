export const ACCOUNTING_DATA = {
  tunisia: {
    country: "Tunisia",
    flag: "🇹🇳",
    currency: "TND",
    invoices: [
      { id: "INV-TN-1042", client: "Marwan Abdeddaiem", amount: 1240, status: "overdue", date: "2026-08-12" },
      { id: "INV-TN-1041", client: "Sara Ben Ali", amount: 980, status: "pending", date: "2026-09-04" },
      { id: "INV-TN-1040", client: "Mohamed Aziz Malki", amount: 890, status: "paid", date: "2026-09-01" },
      { id: "INV-TN-1038", client: "Office Schengen batch", amount: 4200, status: "paid", date: "2026-08-22" },
      { id: "INV-TN-1035", client: "Yassine Trabelsi", amount: 1450, status: "paid", date: "2026-08-15" },
    ],
    expenses: [
      { id: 1, category: "Translation", amount: 320, note: "FR/EN sworn packs", date: "2026-09-08" },
      { id: 2, category: "Courier", amount: 95, note: "Embassy drop express", date: "2026-09-11" },
      { id: 3, category: "Rent", amount: 1800, note: "Agency office Lac 2", date: "2026-09-01" },
      { id: 4, category: "Software", amount: 140, note: "OCR & Cloud hosting", date: "2026-09-03" },
      { id: 5, category: "Consular Fees", amount: 560, note: "Visa appointment stamps", date: "2026-09-06" },
    ],
    accounts: [
      { id: "tn-biat", name: "BIAT Operating (Tunis)", currency: "TND", balance: 42890 },
      { id: "tn-stb", name: "STB Reserve Fund", currency: "TND", balance: 15200 },
      { id: "tn-attijari", name: "Attijari Corporate", currency: "TND", balance: 28450 },
      { id: "eu-wise", name: "Wise EUR Account", currency: "EUR", balance: 6100 },
    ],
    cashflow: [
      { month: "Apr", income: 14800, spend: 9200 },
      { month: "May", income: 16100, spend: 8800 },
      { month: "Jun", income: 13900, spend: 10100 },
      { month: "Jul", income: 19200, spend: 11400 },
      { month: "Aug", income: 22100, spend: 10900 },
      { month: "Sep", income: 17680, spend: 2355 },
    ],
  },
  libya: {
    country: "Libya",
    flag: "🇱🇾",
    currency: "LYD",
    invoices: [
      { id: "INV-LY-201", client: "Tareq Al-Gaddafi", amount: 2850, status: "paid", date: "2026-09-05" },
      { id: "INV-LY-202", client: "Khadija Mansour", amount: 1650, status: "pending", date: "2026-09-08" },
      { id: "INV-LY-203", client: "Al-Madar Corporate Group", amount: 7400, status: "paid", date: "2026-08-28" },
      { id: "INV-LY-204", client: "Ahmed Al-Warfali", amount: 1200, status: "overdue", date: "2026-08-19" },
      { id: "INV-LY-205", client: "Fatima Al-Zawiya", amount: 3100, status: "paid", date: "2026-08-10" },
    ],
    expenses: [
      { id: 1, category: "Office Rent", amount: 3200, note: "Tripoli Dat El Emad Complex", date: "2026-09-01" },
      { id: 2, category: "Translation", amount: 650, note: "Arabic / Italian official packs", date: "2026-09-07" },
      { id: 3, category: "Logistics", amount: 480, note: "Tripoli to Tunis courier dispatch", date: "2026-09-09" },
      { id: 4, category: "Utilities & Fuel", amount: 380, note: "Generator fuel & telecom", date: "2026-09-04" },
      { id: 5, category: "Legal / Notary", amount: 520, note: "Commercial registration filing", date: "2026-09-02" },
    ],
    accounts: [
      { id: "ly-jumhouria", name: "Jumhouria Bank (Tripoli Central)", currency: "LYD", balance: 94500 },
      { id: "ly-sahara", name: "Sahara Bank (Benghazi)", currency: "LYD", balance: 48200 },
      { id: "ly-vault", name: "Cash Vault (Tripoli Office)", currency: "LYD", balance: 12300 },
      { id: "ly-usd", name: "USD Commercial Account", currency: "USD", balance: 18500 },
    ],
    cashflow: [
      { month: "Apr", income: 28400, spend: 14200 },
      { month: "May", income: 31200, spend: 16800 },
      { month: "Jun", income: 27500, spend: 15300 },
      { month: "Jul", income: 36800, spend: 18900 },
      { month: "Aug", income: 42300, spend: 19400 },
      { month: "Sep", income: 34500, spend: 5230 },
    ],
  },
};

// Backward compatibility exports
export const INVOICES = ACCOUNTING_DATA.tunisia.invoices;
export const EXPENSES = ACCOUNTING_DATA.tunisia.expenses;
export const ACCOUNTS = ACCOUNTING_DATA.tunisia.accounts;
export const CASHFLOW = ACCOUNTING_DATA.tunisia.cashflow;
