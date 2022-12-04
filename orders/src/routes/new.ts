import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@btlancelot/common";
import { body } from "express-validator";
import { Product } from "../models/product";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("productId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ProductId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { productId } = req.body;

    // Find the product the user is trying to order in the database
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError();
    }

    // Make sure that this product is not already reserved
    const isReserved = await product.isReserved();
    if (isReserved) {
      throw new BadRequestError("Product is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      product,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      product: {
        id: product.id,
        price: product.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
