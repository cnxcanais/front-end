import { setupWorker } from "msw/browser"
import { corretorasHandlers } from "./corretorasHandlers"
import { seguradorasHandlers } from "./seguradorasHandlers"

const handlers = [...seguradorasHandlers, ...corretorasHandlers]

export const worker = setupWorker(...handlers)
