import { eventBus } from "../util/eventBus";

export const [onLocalStorageChange, triggerLocalStorageChange] =
  eventBus<void>();
export const [onSessionStorageChange, triggerSessionStorageChange] =
  eventBus<void>();
