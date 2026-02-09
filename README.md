# Different Workers Communication via BroadcastChannel

Electron + Vue 3 + TypeScript demo: two Web Workers running in separate `BrowserWindow` instances and exchanging data through a BroadcastChannel-based bridge.

## Why the BroadcastChannel lives in the renderer

Electron launches each browser window in its own renderer process. Shared workers are not shared across those processes, so a BroadcastChannel created inside a worker would stay isolated. Keeping the channel in the renderer guarantees both windows participate in the same origin context (`http://localhost:5173` during dev) and can relay messages between their dedicated workers. The bridge object hides these details and provides a stable desktop/browser-friendly communication layer.

## Architecture

```
Worker A (setInterval 2s → random message)
  └──► postMessage → Renderer 1 (displays original message)
                      └──► BroadcastChannel("worker-bus") → Renderer 2
                                                              └──► postMessage → Worker B (enriches)
                                                                                  └──► postMessage → Renderer 2 (displays enriched)
```

**Bus:** `BroadcastChannel` — native, zero-config API that works across every browsing context with the same origin.

## Getting started

```bash
npm install
npm run dev
```
