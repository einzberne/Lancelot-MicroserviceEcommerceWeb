import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@btlancelot/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
