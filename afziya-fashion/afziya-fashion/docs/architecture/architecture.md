# Architecture

```
 Customer web (React)   Android (Expo, Phase 11)   Owner dashboard (React, /admin)
            \                    |                         /
             +----------- Appwrite Cloud -----------------+
                          Auth - Databases - Storage - Functions
                                                |
                      Functions (server-side, API key, audit logging)
        payment-verification  order-management  inventory-management
        financial-reports  ai-product-generator  ai-page-builder  ai-business-assistant
                                                |
                                   Razorpay - AI API (secrets live here only)
```

## Roles (Appwrite Teams + permissions)
| Role | How identified | Access |
|---|---|---|
| Owner | member of team `owner` | everything, including private financial data and admin permissions |
| Authorized admin | member of team `admins` + row in `admin_permissions` | only what the owner granted, private data only through Functions |
| Customer | signed-in user | own profile, cart, wishlist, addresses, orders (document-level permissions) |
| Public | no session | read published catalog, banners, pages |

## Principles
- **Defence in depth:** route guards in React are for usability only. Real enforcement is collection and document permissions plus server checks inside Functions.
- **Private data has no client write path.** `sales`, `customer_ledger`, `expenses`, `daily_reports`, `admin_permissions`, `audit_logs` are readable by the owner team only; every write is a Function that validates the caller, writes the record and an audit log.
- **Money in integer paise**, never floats.
- **Ledger is append-only:** a payment is a new `customer_ledger` entry; balance = charges - payments. Nothing is overwritten.
- **Revenue vs collections:** revenue comes from `sales.totalPaise`; collections come from ledger payments and paid orders. Unpaid balances are never counted as collected.
- **Profit** = sales minus product cost (`inventory.costPaise`, staff-only) minus expenses. Not shown when costs are missing.
- **Payments:** Razorpay signature verified in a Function; unique index on `razorpayPaymentId` prevents duplicate processing. Opening WhatsApp never marks an order paid.
- **Stock** is tracked per size/colour variant in `inventory`; Functions decrement it atomically on confirmed payment. `product_variants.inStock` is the public flag.
