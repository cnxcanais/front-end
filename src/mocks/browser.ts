import { setupWorker } from "msw/browser"
import { corretorasHandlers } from "./corretorasHandlers"
import { produtoresHandlers } from "./produtoresHandlers"
import { seguradorasHandlers } from "./seguradorasHandlers"

const handlers = [...seguradorasHandlers, ...corretorasHandlers, ...produtoresHandlers]

export const worker = setupWorker(...handlers)
