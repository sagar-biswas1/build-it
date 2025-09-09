export const ALLOWED_TABLES = ["Customer", "Item", "Order", "OrderLineItem", "Invoice", "InvoiceLineItem", "Transaction"];
type TableName = typeof ALLOWED_TABLES[number];

export const ALLOWED_COLUMNS: Record<TableName, string[]>
    = {
    Customer: ["id", "name", "email", "createdAt", "updatedAt"],
    Item: ["id", "name", "description", "price", "stockQuantity", "createdAt", "updatedAt"],
    Order: ["id", "customerId", "orderDate", "status", "shippingFee", "tax", "createdAt", "updatedAt"],
    OrderLineItem: ["id", "orderId", "itemId", "quantity", "unitPrice", "createdAt", "updatedAt"],
    Invoice: ["id", "orderId", "invoiceDate", "dueDate", "status", "tax", "createdAt", "updatedAt"],
    InvoiceLineItem: ["id", "invoiceId", "orderLineItemId", "quantity", "unitPrice", "createdAt", "updatedAt"],
    Transaction: ["id", "invoiceId", "amount", "paymentMethod", "transactionDate", "status", "createdAt", "updatedAt"],
};
