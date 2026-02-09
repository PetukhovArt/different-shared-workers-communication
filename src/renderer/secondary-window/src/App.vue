<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BroadcastChannelSharedWorkerBridge } from '../../shared/shared-worker-bridge'

const messages = ref<string[]>([])

let bridge: BroadcastChannelSharedWorkerBridge | null = null

onMounted(() => {
  bridge = new BroadcastChannelSharedWorkerBridge({
    workerUrl: new URL('../../../workers/worker-b.ts', import.meta.url),
    channelName: 'worker-bus'
  })

  bridge.onWorkerMessage((data) => {
    const msg = data as { type: string; payload: string }
    if (msg.type !== 'enriched') return

    messages.value = [msg.payload, ...messages.value.slice(0, 19)]
  })

  bridge.onBusMessage((data) => {
    const msg = data as { type: string; payload: string }
    if (msg.type !== 'from-worker-a') return

    bridge?.sendToWorker({ type: 'from-worker-a', payload: msg.payload })
  })
})

onUnmounted(() => {
  bridge?.destroy()
})
</script>

<template>
  <div style="font-family: monospace; padding: 16px">
    <h2>Window 2 — Worker B (Relay)</h2>
    <p>Receives via <b>BroadcastChannel</b>, enriches in Worker B, and displays</p>
    <hr />
    <ul>
      <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
    </ul>
    <p v-if="!messages.length" style="color: gray">Waiting for enriched messages...</p>
  </div>
</template>
