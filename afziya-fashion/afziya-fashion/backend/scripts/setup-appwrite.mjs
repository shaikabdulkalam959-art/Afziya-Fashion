// Creates the AFZIYA FASHION database, 25 collections, attributes, indexes and permissions.
// Safe to re-run: anything that already exists is skipped.
// Usage: copy .env.example to .env, fill it, then:  node --env-file=.env scripts/setup-appwrite.mjs
import { Client, Databases, Permission, Role } from 'node-appwrite';

const {
  APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY,
  APPWRITE_DATABASE_ID = 'afziya_db', OWNER_TEAM_ID = 'owner', ADMIN_TEAM_ID = 'admins',
} = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error('Missing APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID or APPWRITE_API_KEY. Fill backend/.env first.');
  process.exit(1);
}

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID).setKey(APPWRITE_API_KEY);
const db = new Databases(client);
const DB = APPWRITE_DATABASE_ID;

const owner = Role.team(OWNER_TEAM_ID);
const admins = Role.team(ADMIN_TEAM_ID);

// ---- Permission profiles -------------------------------------------------
// Money is stored as integer paise (₹1 = 100) to avoid floating-point errors.
const PERMS = {
  // Anyone can read; only owner/admins can change (e.g. products, banners, pages).
  catalog: { docSec: false, p: [Permission.read(Role.any()), Permission.create(owner), Permission.update(owner), Permission.delete(owner), Permission.create(admins), Permission.update(admins), Permission.delete(admins)] },
  // Staff only (owner + admins) — e.g. inventory, customers.
  staff: { docSec: false, p: [Permission.read(owner), Permission.create(owner), Permission.update(owner), Permission.delete(owner), Permission.read(admins), Permission.create(admins), Permission.update(admins)] },
  // Customer-owned rows: document-level permissions are set per user at creation time.
  userDocs: { docSec: true, p: [Permission.create(Role.users()), Permission.read(owner), Permission.read(admins)] },
  // Created only by server functions; the customer gets read access per document.
  serverWritten: { docSec: true, p: [Permission.read(owner), Permission.read(admins)] },
  // PRIVATE: owner can read. Nobody can write from a client. All writes go through
  // protected Appwrite Functions (API key), which also write audit_logs.
  // Admins get private data only via functions that check admin_permissions.
  private: { docSec: false, p: [Permission.read(owner)] },
};

// ---- Attribute helpers ---------------------------------------------------
const s = (key, size = 255, required = false, array = false) => ({ t: 's', key, size, required, array });
const i = (key, required = false) => ({ t: 'i', key, required });
const b = (key, required = false) => ({ t: 'b', key, required });
const d = (key, required = false) => ({ t: 'd', key, required });

const C = (id, name, perm, attrs, indexes = []) => ({ id, name, perm, attrs, indexes });
const idx = (key, type, attributes) => ({ key, type, attributes });

const COLLECTIONS = [
  C('users', 'users', 'staff', [s('userId', 36, true), s('email', 255, true), s('name', 128), s('role', 20, true), s('status', 20)], [idx('uniq_userId', 'unique', ['userId'])]),
  C('profiles', 'profiles', 'userDocs', [s('userId', 36, true), s('fullName', 128), s('phone', 20), s('gender', 10), s('avatarFileId', 36)], [idx('uniq_userId', 'unique', ['userId'])]),
  C('categories', 'categories', 'catalog', [s('name', 100, true), s('slug', 120, true), s('gender', 10, true), s('parentId', 36), s('imageFileId', 36), i('sortOrder'), b('isActive')], [idx('uniq_slug', 'unique', ['slug'])]),
  C('products', 'products', 'catalog', [s('name', 200, true), s('slug', 220, true), s('description', 5000), s('categoryId', 36, true), s('gender', 10, true), s('tags', 50, false, true), i('pricePaise', true), i('salePricePaise'), s('status', 12, true), b('isTrending'), b('isNewArrival'), s('createdBy', 36)], [idx('uniq_slug', 'unique', ['slug']), idx('by_category', 'key', ['categoryId']), idx('by_status', 'key', ['status'])]),
  C('product_images', 'product_images', 'catalog', [s('productId', 36, true), s('fileId', 36, true), i('sortOrder'), s('alt', 200)], [idx('by_product', 'key', ['productId'])]),
  C('product_variants', 'product_variants', 'catalog', [s('productId', 36, true), s('sku', 64, true), s('size', 10, true), s('color', 30, true), s('colorHex', 9), b('inStock'), b('isActive')], [idx('uniq_sku', 'unique', ['sku']), idx('by_product', 'key', ['productId'])]),
  // Cost lives here (staff-only), never on the public products collection.
  C('inventory', 'inventory', 'staff', [s('variantId', 36, true), s('productId', 36, true), i('quantity', true), i('reservedQty'), i('lowStockThreshold'), i('costPaise')], [idx('uniq_variant', 'unique', ['variantId']), idx('by_product', 'key', ['productId'])]),
  C('customers', 'customers', 'staff', [s('name', 128, true), s('mobile', 20, true), s('email', 255), s('notes', 1000), s('createdBy', 36)], [idx('by_mobile', 'key', ['mobile'])]),
  C('carts', 'carts', 'userDocs', [s('userId', 36, true), s('status', 12)], [idx('by_user', 'key', ['userId'])]),
  C('cart_items', 'cart_items', 'userDocs', [s('cartId', 36, true), s('userId', 36, true), s('productId', 36, true), s('variantId', 36, true), i('quantity', true)], [idx('by_cart', 'key', ['cartId'])]),
  C('wishlist', 'wishlist', 'userDocs', [s('userId', 36, true), s('productId', 36, true)], [idx('by_user', 'key', ['userId'])]),
  C('orders', 'orders', 'serverWritten', [s('orderNumber', 32, true), s('userId', 36), s('customerName', 128), s('mobile', 20), s('addressJson', 2000), s('source', 16, true), s('status', 20, true), s('paymentStatus', 20, true), i('subtotalPaise', true), i('discountPaise'), i('shippingPaise'), i('totalPaise', true), s('couponCode', 40), s('carrier', 60), s('trackingId', 80)], [idx('uniq_orderNumber', 'unique', ['orderNumber']), idx('by_user', 'key', ['userId']), idx('by_status', 'key', ['status'])]),
  C('order_items', 'order_items', 'serverWritten', [s('orderId', 36, true), s('userId', 36), s('productId', 36, true), s('variantId', 36, true), s('name', 200, true), s('size', 10), s('color', 30), i('quantity', true), i('unitPricePaise', true)], [idx('by_order', 'key', ['orderId'])]),
  C('payments', 'payments', 'serverWritten', [s('orderId', 36, true), s('userId', 36), s('provider', 16, true), s('razorpayOrderId', 64), s('razorpayPaymentId', 64), b('signatureVerified'), s('status', 20, true), i('amountPaise', true), s('method', 20)], [idx('uniq_rzp_payment', 'unique', ['razorpayPaymentId']), idx('by_order', 'key', ['orderId'])]),
  C('addresses', 'addresses', 'userDocs', [s('userId', 36, true), s('label', 30), s('line1', 200, true), s('line2', 200), s('city', 80, true), s('state', 80, true), s('pincode', 10, true), s('phone', 20), b('isDefault')], [idx('by_user', 'key', ['userId'])]),
  C('coupons', 'coupons', 'catalog', [s('code', 40, true), s('type', 12, true), i('value', true), i('minOrderPaise'), i('maxUses'), i('usedCount'), d('startsAt'), d('endsAt'), b('isActive')], [idx('uniq_code', 'unique', ['code'])]),
  C('banners', 'banners', 'catalog', [s('title', 200, true), s('subtitle', 300), s('imageFileId', 36), s('linkUrl', 500), s('placement', 30), i('sortOrder'), b('isActive')]),
  C('pages', 'pages', 'catalog', [s('title', 200, true), s('slug', 120, true), s('contentJson', 100000), s('status', 12, true), d('publishedAt'), s('createdBy', 36)], [idx('uniq_slug', 'unique', ['slug'])]),
  // ---- PRIVATE collections ----
  C('sales', 'sales', 'private', [s('saleNumber', 32, true), s('customerId', 36), s('channel', 16, true), i('totalPaise', true), i('paidPaise', true), i('balancePaise', true), i('discountPaise'), d('saleDate', true), s('orderId', 36), s('createdBy', 36, true)], [idx('uniq_saleNumber', 'unique', ['saleNumber']), idx('by_date', 'key', ['saleDate']), idx('by_customer', 'key', ['customerId'])]),
  C('sale_items', 'sale_items', 'private', [s('saleId', 36, true), s('productId', 36, true), s('variantId', 36), s('name', 200, true), i('quantity', true), i('unitPricePaise', true), i('costPaise')], [idx('by_sale', 'key', ['saleId'])]),
  // Append-only: a charge or payment is never edited or deleted; corrections are new entries.
  C('customer_ledger', 'customer_ledger', 'private', [s('customerId', 36, true), s('saleId', 36), s('entryType', 16, true), i('amountPaise', true), s('method', 16), d('entryDate', true), d('expectedPaymentDate'), s('notes', 1000), s('createdBy', 36, true)], [idx('by_customer', 'key', ['customerId']), idx('by_date', 'key', ['entryDate'])]),
  C('expenses', 'expenses', 'private', [s('category', 60, true), s('description', 500), i('amountPaise', true), s('method', 16), d('expenseDate', true), s('createdBy', 36, true)], [idx('by_date', 'key', ['expenseDate'])]),
  C('daily_reports', 'daily_reports', 'private', [s('reportDate', 10, true), i('salesPaise'), i('ordersCount'), i('cashPaise'), i('upiPaise'), i('cardPaise'), i('onlinePaise'), i('whatsappOrders'), i('expensesPaise'), i('pendingPaise'), d('generatedAt')], [idx('uniq_date', 'unique', ['reportDate'])]),
  C('admin_permissions', 'admin_permissions', 'private', [s('userId', 36, true), b('canViewDailyBusiness'), b('canViewPendingBalances'), b('canViewFinancialReports'), b('canManageProducts'), b('canManageOrders'), b('canManageCustomers'), b('canManagePages'), s('grantedBy', 36)], [idx('uniq_userId', 'unique', ['userId'])]),
  C('audit_logs', 'audit_logs', 'private', [s('actorId', 36, true), s('action', 60, true), s('entity', 60, true), s('entityId', 36), s('beforeJson', 10000), s('afterJson', 10000), s('ip', 60)], [idx('by_entity', 'key', ['entity', 'entityId']), idx('by_actor', 'key', ['actorId'])]),
];

// ---- Helpers -------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (e) => e?.code === 409;

async function safe(label, fn) {
  try { await fn(); console.log('  + ' + label); }
  catch (e) { if (exists(e)) console.log('  = ' + label + ' (exists)'); else { console.error('  ! ' + label + ': ' + e.message); throw e; } }
}

async function waitForAttributes(collectionId) {
  for (let n = 0; n < 60; n++) {
    const { attributes } = await db.listAttributes(DB, collectionId);
    if (attributes.every((a) => a.status === 'available')) return;
    await sleep(1000);
  }
  throw new Error('Timed out waiting for attributes of ' + collectionId);
}

async function main() {
  console.log('Database: ' + DB);
  await safe('database ' + DB, () => db.create(DB, 'AFZIYA FASHION'));

  for (const c of COLLECTIONS) {
    console.log('\n' + c.id + '  [' + c.perm + ']');
    const prof = PERMS[c.perm];
    await safe('collection', () => db.createCollection(DB, c.id, c.name, prof.p, prof.docSec, true));
    for (const a of c.attrs) {
      await safe('attr ' + a.key, () => {
        if (a.t === 's') return db.createStringAttribute(DB, c.id, a.key, a.size, a.required, undefined, a.array);
        if (a.t === 'i') return db.createIntegerAttribute(DB, c.id, a.key, a.required);
        if (a.t === 'b') return db.createBooleanAttribute(DB, c.id, a.key, a.required);
        return db.createDatetimeAttribute(DB, c.id, a.key, a.required);
      });
    }
    await waitForAttributes(c.id);
    for (const x of c.indexes) await safe('index ' + x.key, () => db.createIndex(DB, c.id, x.key, x.type, x.attributes));
  }
  console.log('\nDone. 25 collections ready.');
}

main().catch((e) => { console.error(e); process.exit(1); });
