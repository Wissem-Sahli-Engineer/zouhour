export const MY_REQUESTS = [
  { id: 1, type: "Vacation", detail: "Nov 3 – Nov 10", submitted: "Oct 20", status: "approved" },
  { id: 2, type: "Salary Advance", detail: "TND 400", submitted: "Sep 28", status: "pending" },
  { id: 3, type: "Loan", detail: "TND 1,500 · 6 months", submitted: "Aug 12", status: "rejected" },
];

export const EMPLOYEE_REQUESTS = {
  vacations: [
    { id: 1, employee: "Marwan A.", detail: "Nov 3 – Nov 10 (5 days)", submitted: "Oct 20", status: "pending" },
    { id: 2, employee: "Sara B.", detail: "Dec 22 – Jan 2 (8 days)", submitted: "Oct 15", status: "approved" },
  ],
  "salary-advances": [
    { id: 1, employee: "Yassine K.", detail: "TND 300", submitted: "Oct 18", status: "pending" },
    { id: 2, employee: "Nour H.", detail: "TND 600", submitted: "Sep 30", status: "approved" },
  ],
  loans: [
    { id: 1, employee: "Marwan A.", detail: "TND 2,000 · 10 months", submitted: "Oct 5", status: "pending" },
    { id: 2, employee: "Sara B.", detail: "TND 1,000 · 4 months", submitted: "Aug 22", status: "rejected" },
  ],
};

export const BADGE_TONE = {
  approved: "badge-success",
  pending: "badge-warning",
  rejected: "badge-danger",
};
