export const FALLBACK_CLIENTS = [
  {
    id: 1,
    given_name: "Mohamed Aziz",
    surname: "Malki",
    passport_number: "Y126578",
    country: "Tunisia",
    nationality: "Tunisian",
    type: "P",
    date_of_birth: "2002-04-06",
    sex: "M",
    place_of_birth: "Tunis",
    date_of_issue: "2020-05-02",
    date_of_expiry: "2025-05-03",
    issued_by: "Tunis",
    phone: "+216 21 440 118",
    user_photo: "",
    applications: [
      { id: "SCH-2041", type: "Schengen short stay", status: "In review", submitted: "2026-09-02" },
    ],
    documents: ["Passport scan", "Hotel booking", "Bank statement"],
    invoices: [{ id: "INV-1040", amount: "TND 890", status: "paid" }],
  },
  {
    id: 3,
    given_name: "Marwan",
    surname: "Abdeddaiem",
    passport_number: "H017700",
    country: "Tunisia",
    nationality: "Tunisian",
    type: "P",
    date_of_birth: "1993-07-30",
    sex: "M",
    place_of_birth: "Gabes",
    date_of_issue: "2020-03-30",
    date_of_expiry: "2025-03-29",
    issued_by: "Gabes",
    phone: "+216 98 112 440",
    user_photo: "",
    applications: [
      { id: "UK-771", type: "UK visitor", status: "Pending docs", submitted: "2026-09-10" },
    ],
    documents: ["Passport scan", "Invitation letter"],
    invoices: [{ id: "INV-1042", amount: "TND 1,240", status: "overdue" }],
  },
];

export function enrich(client) {
  return {
    phone: client.phone || "+216 —",
    applications: client.applications || [
      { id: `APP-${client.id}`, type: "Schengen short stay", status: "Submitted", submitted: client.created_at?.slice(0, 10) || "2026-09-01" },
    ],
    documents: client.documents || ["Passport scan"],
    invoices: client.invoices || [{ id: `INV-${1000 + (client.id || 0)}`, amount: "TND 750", status: "pending" }],
    ...client,
  };
}
