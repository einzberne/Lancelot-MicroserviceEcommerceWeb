import { Subjects, Publisher, OrderCancelledEvent } from "@btlancelot/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
