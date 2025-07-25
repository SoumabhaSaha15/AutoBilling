import mongoose from "mongoose";
const aggrigation = [
  {
    $unwind: "$orders" // Flatten the orders array
  },
  {
    $lookup: {
      from: "product_models", // Assuming your product collection name is "products"
      localField: "orders.productId",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  {
    $unwind: "$productDetails"
  },
  {
    $group: {
      _id: "$_id",
      dateTime: { $first: "$dateTime" },
      employeeEmail: { $first: "$employeeEmail" },
      customerEmail: { $first: "$customerEmail" },
      ordersCount: { $sum: "$orders.quantity" }, // Sum of quantities
      totalAmount: {
        $sum: {
          $multiply: [
            "$orders.quantity",
            "$productDetails.price"
          ]
        }
      }
    }
  },
  {
    $project: {
      dateTime: 1,
      customerEmail: 1,
      ordersCount: 1,
      totalAmount: 1,
      employeeEmail: 1,
      _id: 1
    }
  }
];

interface InvoiceBriefView {
  customerEmail: string;
  employeeEmail: string;
  dateTime: string;
  ordersCount: number;
  totalAmount: number;
  _id: mongoose.Types.ObjectId;
}

// 4. Create a Mongoose schema for the view (optional, for type safety)
const InvoiceBriefSchema = new mongoose.Schema<InvoiceBriefView>({
  customerEmail: String,
  employeeEmail: String,
  dateTime: String,
  ordersCount: Number,
  totalAmount: Number,
  _id: mongoose.Schema.Types.ObjectId
}, {
  collection: 'invoice_brief', // Specify the view name
  timestamps: false // Views don't have timestamps
});

// 5. Create a Mongoose model for the view
const InvoiceBriefModel = mongoose.model<InvoiceBriefView>('invoice_brief', InvoiceBriefSchema, 'invoice_brief');

export { InvoiceBriefView, InvoiceBriefSchema, InvoiceBriefModel };
