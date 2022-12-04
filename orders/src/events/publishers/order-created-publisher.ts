import { Publisher, OrderCreatedEvent, Subjects } from "@btlancelot/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
