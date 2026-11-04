# Database schema (database ID: `afziya_db`)

Source of truth: `backend/scripts/setup-appwrite.mjs`. All money fields end in `Paise`. Every row also has Appwrite's `$id`, `$createdAt`, `$updatedAt`.

| # | Collection | Access | Key fields |
|---|---|---|---|
| 1 | users | staff | userId, email, name, role, status |
| 2 | profiles | own row | userId, fullName, phone, gender |
| 3 | categories | public read | name, slug, gender, parentId, sortOrder, isActive |
| 4 | products | public read | name, slug, description, categoryId, gender, tags[], pricePaise, salePricePaise, status (draft/published), isTrending, isNewArrival |
| 5 | product_images | public read | productId, fileId, sortOrder |
| 6 | product_variants | public read | productId, sku, size, color, colorHex, inStock |
| 7 | inventory | staff | variantId, quantity, reservedQty, lowStockThreshold, costPaise |
| 8 | customers | staff | name, mobile, email, notes |
| 9 | carts | own row | userId, status |
| 10 | cart_items | own row | cartId, variantId, quantity |
| 11 | wishlist | own row | userId, productId |
| 12 | orders | own row (server-written) | orderNumber, source (web/whatsapp/app), status, paymentStatus, totals, trackingId |
| 13 | order_items | own row (server-written) | orderId, variantId, quantity, unitPricePaise |
| 14 | payments | own row (server-written) | orderId, razorpayOrderId, razorpayPaymentId (unique), signatureVerified, status |
| 15 | addresses | own row | userId, line1, city, state, pincode |
| 16 | coupons | public read | code (unique), type, value, startsAt, endsAt |
| 17 | banners | public read | title, imageFileId, placement, isActive |
| 18 | pages | public read | title, slug, contentJson, status |
| 19 | sales | **owner only** | saleNumber, channel, totalPaise, paidPaise, balancePaise, saleDate |
| 20 | sale_items | **owner only** | saleId, productId, quantity, unitPricePaise, costPaise |
| 21 | customer_ledger | **owner only, append-only** | customerId, entryType (charge/payment), amountPaise, method, entryDate, expectedPaymentDate |
| 22 | expenses | **owner only** | category, amountPaise, method, expenseDate |
| 23 | daily_reports | **owner only** | reportDate (unique), sales/collection totals by method |
| 24 | admin_permissions | **owner only** | userId, canViewDailyBusiness, canViewPendingBalances, canViewFinancialReports, ... |
| 25 | audit_logs | **owner only, append-only** | actorId, action, entity, entityId, beforeJson, afterJson |

Access legend: *public read* = anyone reads, owner/admins write. *staff* = owner + admins. *own row* = customer sees only rows created with their user permission. *owner only* = no client can write; Functions write with a server API key.
