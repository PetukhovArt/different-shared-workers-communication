<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BroadcastChannelSharedWorkerBridge } from '../../shared/shared-worker-bridge'

const messages = ref<string[]>([])

let bridge: BroadcastChannelSharedWorkerBridge | null = null

onMounted(() => {
  bridge = new BroadcastChannelSharedWorkerBridge({
    workerUrl: new URL('../../../workers/worker-a.ts', import.meta.url),
    channelName: 'worker-bus'
  })

  bridge.onWorkerMessage((data) => {
    const msg = data as { type: string; payload: string }
    if (msg.type !== 'generated') return

    messages.value = [msg.payload, ...messages.value.slice(0, 19)]
    bridge?.sendToBus({ type: 'from-worker-a', payload: msg.payload })
  })
})

onUnmounted(() => {
  bridge?.destroy()
})
</script>

<template>
  <div style="font-family: monospace; padding: 16px">
    <h2>Window 1 — Worker A (Generator)</h2>
    <p>Generates a random message every 2s, sends via <b>BroadcastChannel</b> to Window 2</p>
    <hr />
    <ul>
      <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
    </ul>
    <p v-if="!messages.length" style="color: gray">Waiting for messages...</p>
  </div>
</template>
