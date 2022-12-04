import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Product } from "../../models/product";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the product does not exist", async () => {
  const productId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId })
    .expect(404);
});

it("returns an error if the product is already reserved", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await product.save();
  const order = Order.build({
    product,
    userId: "laskdflkajsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(400);
});

it("reserves a product", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await product.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await product.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
