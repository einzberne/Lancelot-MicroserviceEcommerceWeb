import { Publisher, Subjects, ProductCreatedEvent } from "@btlancelot/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
