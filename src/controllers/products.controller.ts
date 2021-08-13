/**
 * logic for handling requests
 */

import { NextFunction, Request, Response } from "express";
import { ProductIfc, ProductPutBody } from "../models/interfaces/products";
import Product from "../models/Product";
//models
export async function getAllProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const products = await Product.find();
  res.json({ products });
}
export async function getProdutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  console.log("getting product", id);
  const product = await Product.findById(id);
  res.json({ product });
}
// export async function getProdutHandler(req:Request, res:Response, next:NextFunction) { }
export async function deleteProdutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await Product.findById(req.params.id);
    product ? await product.delete() : null;
    return res.status(200).send();
  } catch (error) {
    return res.status(400).json({ error });
  }
}
export async function postProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("creating product");
  const { category, price, imgUri, name } =
    req.body as unknown as ProductPutBody;
  const newProduct = new Product({ ...req.body });
  try {
    const savedProduct = await newProduct.save();
    return res.status(201).json({ product: savedProduct });
  } catch (errors) {
    return res.status(400).json({ errors });
  }
}

export async function putProdutHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await Product.findById(req.params.id);
    Object.keys(req.body).map((key) =>
      product ? (product[key] = req.body[key]) : null
    );
    await product?.save();
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ error });
  }
}
