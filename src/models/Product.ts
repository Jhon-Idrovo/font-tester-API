import { model, Schema } from "mongoose";
import { ProductIfc } from "./interfaces/products";

const productSchema = new Schema<ProductIfc>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imgUri: { type: String, required: false },
});

export default model<ProductIfc>("Product", productSchema);
