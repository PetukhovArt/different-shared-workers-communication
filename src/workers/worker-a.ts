const WORDS = ['electron', 'vue', 'worker', 'broadcast', 'channel', 'vite', 'typescript'] as const

const randomMessage = (): string => {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  const id = Math.floor(Math.random() * 1000)
  return `${word}-${id}`
}

setInterval(() => {
  const msg = randomMessage()
  self.postMessage({ type: 'generated', payload: msg })
}, 2000)
