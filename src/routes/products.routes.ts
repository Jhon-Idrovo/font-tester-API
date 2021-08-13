/**
 * example routing for a model
 */

import { RequestHandler, Router } from "express";
import * as ProductsCtlr from "../controllers/products.controller";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
const router = Router();
router.get("/", ProductsCtlr.getAllProductsHandler);
router.get("/:id", ProductsCtlr.getProdutHandler);
//with authorization
router.use(verifyTokenMiddleware);
router.post("/create", ProductsCtlr.postProductHandler);
router.delete("/delete", ProductsCtlr.deleteProdutHandler);
router.put("/update/:id", ProductsCtlr.putProdutHandler);
export default router;
