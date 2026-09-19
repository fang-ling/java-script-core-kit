//
//  JavaScriptCoreKit.js
//  javascript-core-kit
//
//  Created by Fang Ling on 2026/4/4.
//
//  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and limitations under the License.
//

let _instance
let _memory
let nodes
let nodeIndex
let eventListeners
let textDecoder

function readString(string, count) {
  return String.fromCodePoint(...(new Uint32Array(_memory.buffer, string, Number(count))))
}

function getNode(nodeID) {
  if (nodeID === 0) {
    return document.body
  }

  return nodes.get(nodeID)
}

function getEventTypeName(type) {
  switch (type) {
    case 1: return "click"
    case 16384: return "scroll"
  }
}

export function JavaScriptCoreInitialize(instance, memory) {
  _instance = instance
  _memory = memory
  nodes = new Map()
  nodeIndex = 0
  eventListeners = new Map()
  textDecoder = new TextDecoder("utf-8")
}

export function JavaScriptCoreMeasureTextSize(textBuffer, textBufferCount, styleTextBuffer, styleTextBufferCount, result) {
  const element = document.createElement("div")
  element.textContent = readString(textBuffer, textBufferCount)
  element.style.cssText = `position:absolute; visibility:hidden; pointer-events:none; white-space: pre; ${readString(styleTextBuffer, styleTextBufferCount)}`
  document.body.appendChild(element)

  const { width, height } = element.getBoundingClientRect()

  const memoryView = new Float32Array(_memory.buffer)
  memoryView[result / 4] = width
  memoryView[result / 4 + 1] = height

  element.remove()
}

export function JavaScriptCoreNodeSetSourceContent(nodeID, sourceContentBuffer, sourceContentBufferCount) {
  const node = getNode(nodeID)
  if (!node) {
    return
  }

  node.src = readString(sourceContentBuffer, sourceContentBufferCount)
}

export function JavaScriptCoreNodeSetTextContent(nodeID, textContentBuffer, textContentBufferCount) {
  const node = getNode(nodeID)
  if (!node) {
    return
  }

  node.textContent = readString(textContentBuffer, textContentBufferCount)
}

export function JavaScriptCoreNodeAddEventListener(nodeID, type) {
  if (!eventListeners.has(nodeID)) {
    eventListeners.set(nodeID, new Map())
  }

  const typeName = getEventTypeName(type)

  const eventHandler = () => {
    if (type === 16384) {
      const node = getNode(nodeID)
      _instance.exports.UIKitDispatchScrollEvent(nodeID, node.scrollLeft, node.scrollTop)
    } else {
      _instance.exports.UIKitDispatchControlEvent(nodeID, 1)
    }
  }

  eventListeners.get(nodeID).set(typeName, eventHandler)
  getNode(nodeID)?.addEventListener(typeName, eventHandler)
}

export function JavaScriptCoreNodeRemoveEventListener(nodeID, type) {
  let typeName = getEventTypeName(type)

  getNode(nodeID)?.removeEventListener(typeName, eventListeners.get(nodeID).get(typeName))
  eventListeners.get(nodeID).delete(typeName)

  if (eventListeners.get(nodeID).size <= 0) {
    eventListeners.delete(nodeID)
  }
}

export function JavaScriptCoreNodeAddSubnode(nodeID, subnodeID) {
  const node = getNode(nodeID)
  const subnode = getNode(subnodeID)

  node.appendChild(subnode)
}

export function JavaScriptCoreGlobalObjectFetch(requestID, urlBuffer, urlBufferCount, requestBuffer, requestBufferCount) {
  fetch(readString(urlBuffer, urlBufferCount), JSON.parse(readUTF8String(requestBuffer, requestBufferCount)))
    .then((response) => {
      response.arrayBuffer()
        .then((buffer) => {
          const data = new Uint8Array(buffer)

          const pointer = _instance.exports.malloc(data.length + 1)

          const memory = new Uint8Array(_instance.exports.memory.buffer)
          memory.set(data, pointer)
          memory[pointer + data.length] = 0

          _instance.exports.JavaScriptCoreGlobalObjectFetchDidFinish(requestID, pointer)

          _instance.exports.free(pointer)
        })
        .finally(() => {
          _instance.exports.UIKitDispatchControlEvent(-1, -1)
        })
    })
    .catch((reason) => {
      console.log(reason)
      // TODO, also need to dispatch event here
    })
}
