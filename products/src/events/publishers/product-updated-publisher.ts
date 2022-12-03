import { Publisher, Subjects, ProductUpdatedEvent } from "@btlancelot/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
