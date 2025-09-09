// import { PrismaClient } from "@/generated/prisma";


// const prisma = new PrismaClient();

// async function seed() {
//     // Seed Customers
//     const customers = await Promise.all(
//         Array.from({ length: 10 }, (_, i) => {
//             return prisma.customer.upsert({
//                 where: { email: `customer${i + 1}@example.com` },
//                 update: {},
//                 create: {
//                     name: `Customer ${i + 1}`,
//                     email: `customer${i + 1}@example.com`,
//                     billingAddress: `Billing Address ${i + 1}, City`,
//                     shippingAddress: `Shipping Address ${i + 1}, City`,
//                 },
//             });
//         })
//     );

//     // Seed Items
//     const items = await Promise.all(
//         Array.from({ length: 10 }, (_, i) => {
//             return prisma.item.upsert({
//                 where: { id: i + 1 },
//                 update: {},
//                 create: {
//                     name: `Item ${i + 1}`,
//                     description: `Description for Item ${i + 1}`,
//                     price: 10.99 + i * 5,
//                     stockQuantity: 100 - i * 5,
//                 },
//             });
//         })
//     );

//     // Seed Orders (Fixed)
//     const orders = await Promise.all(
//         Array.from({ length: 10 }, async (_, i) => {
//             return prisma.order.upsert({
//                 where: { id: i + 1 }, // Dynamic id based on loop index
//                 update: {},
//                 create: {
//                     customerId: customers[i % customers.length].id, // Use customer from seeded data
//                     orderDate: new Date(`2025-08-${String(i + 1).padStart(2, '0')}T10:00:00Z`), // Valid date
//                     status: i % 2 === 0 ? 'Pending' : 'Shipped',
//                     shippingFee: i % 2 === 0 ? 5.0 : 10.0,
//                     tax: 0.0,
//                 },
//             });
//         })
//     );

//     // Seed OrderLineItems
//     const orderLineItems = await Promise.all(
//         Array.from({ length: 20 }, async (_, i) => {
//             return prisma.orderLineItem.upsert({
//                 where: { id: i + 1 },
//                 update: {},
//                 create: {
//                     orderId: orders[i % orders.length].id,
//                     itemId: items[i % items.length].id,
//                     quantity: (i % 3) + 1,
//                     unitPrice: items[i % items.length].price,
//                 },
//             });
//         })
//     );

//     // Seed Invoices
//     const invoices = await Promise.all(
//         Array.from({ length: 10 }, async (_, i) => {
//             return prisma.invoice.upsert({
//                 where: { id: i + 1 },
//                 update: {},
//                 create: {
//                     orderId: orders[i % orders.length].id,
//                     invoiceDate: new Date(`2025-08-${String(i + 1).padStart(2, '0')}T12:00:00Z`),
//                     dueDate: new Date(`2025-09-${String(i + 1).padStart(2, '0')}T12:00:00Z`),
//                     status: i % 2 === 0 ? 'Issued' : 'Paid',
//                     tax: 0.0,
//                 },
//             });
//         })
//     );

//     // Seed InvoiceLineItems
//     const invoiceLineItems = await Promise.all(
//         Array.from({ length: 20 }, async (_, i) => {
//             return prisma.invoiceLineItem.upsert({
//                 where: { id: i + 1 },
//                 update: {},
//                 create: {
//                     invoiceId: invoices[i % invoices.length].id,
//                     orderLineItemId: orderLineItems[i % orderLineItems.length].id,
//                     quantity: orderLineItems[i % orderLineItems.length].quantity,
//                     unitPrice: orderLineItems[i % orderLineItems.length].unitPrice,
//                 },
//             });
//         })
//     );

//     // Seed Transactions
//     await Promise.all(
//         Array.from({ length: 10 }, async (_, i) => {
//             return prisma.transaction.upsert({
//                 where: { id: i + 1 },
//                 update: {},
//                 create: {
//                     invoiceId: invoices[i % invoices.length].id,
//                     amount: orderLineItems[i % orderLineItems.length].unitPrice * orderLineItems[i % orderLineItems.length].quantity,
//                     paymentMethod: i % 2 === 0 ? 'CreditCard' : 'PayPal',
//                     transactionDate: new Date(`2025-08-${String(i + 1).padStart(2, '0')}T14:00:00Z`),
//                     status: i % 2 === 0 ? 'Authorized' : 'Captured',
//                     gatewayToken: `txn_${i + 1}`,
//                 },
//             });
//         })
//     );

//     console.log('Seeding completed!');
// }

// seed()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });