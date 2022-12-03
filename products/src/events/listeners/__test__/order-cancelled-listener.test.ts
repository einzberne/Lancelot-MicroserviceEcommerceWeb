import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@btlancelot/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Product } from "../../../models/product";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const product = Product.build({
    title: "concert",
    price: 20,
    userId: "asdf",
  });
  product.set({ orderId });
  await product.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    product: {
      id: product.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, product, orderId, listener };
};

it("updates the product, publishes an event, and acks the message", async () => {
  const { msg, data, product, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);
  expect(updatedProduct!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
