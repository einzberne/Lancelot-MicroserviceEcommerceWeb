import { Subjects, Publisher, PaymentCreatedEvent } from "@btlancelot/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
