self.onmessage = (e: MessageEvent): void => {
  if (e.data?.type !== 'from-worker-a') return

  const enriched = `[WorkerB] received: "${e.data.payload}" → enriched ✓`
  self.postMessage({ type: 'enriched', payload: enriched })
}
