import { setupWorker } from "msw/browser"
import { seguradorasHandlers } from "./seguradorasHandlers"

const handlers = [...seguradorasHandlers]

export const worker = setupWorker(...handlers)
