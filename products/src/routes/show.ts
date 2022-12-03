import express, { Request, Response } from "express";
import { NotFoundError } from "@btlancelot/common";
import { Product } from "../models/product";

const router = express.Router();

router.get("/api/products/:id", async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new NotFoundError();
  }

  res.send(product);
});

export { router as showProductRouter };
