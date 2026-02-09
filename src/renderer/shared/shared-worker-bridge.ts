type MessageHandler = (data: unknown) => void

type SharedWorkerBridgeParams = {
  workerUrl: URL
  channelName: string
}

abstract class SharedWorkerBridge {
  protected worker: Worker
  protected readonly channelName: string

  constructor({ workerUrl, channelName }: SharedWorkerBridgeParams) {
    this.worker = new Worker(workerUrl, { type: 'module' })
    this.channelName = channelName
  }

  sendToWorker(message: unknown): void {
    this.worker.postMessage(message)
  }

  onWorkerMessage(handler: MessageHandler): void {
    this.worker.onmessage = (e: MessageEvent) => handler(e.data)
  }

  abstract sendToBus(message: unknown): void
  abstract onBusMessage(handler: MessageHandler): void
  abstract destroy(): void
}

class BroadcastChannelSharedWorkerBridge extends SharedWorkerBridge {
  private readonly bus: BroadcastChannel

  constructor(params: SharedWorkerBridgeParams) {
    super(params)
    this.bus = new BroadcastChannel(params.channelName)
  }

  sendToBus(message: unknown): void {
    this.bus.postMessage(message)
  }

  onBusMessage(handler: MessageHandler): void {
    this.bus.onmessage = (e: MessageEvent) => handler(e.data)
  }

  destroy(): void {
    this.worker.terminate()
    this.bus.close()
  }
}

export { SharedWorkerBridge, BroadcastChannelSharedWorkerBridge }
export type { MessageHandler, SharedWorkerBridgeParams }
