//===----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------===//
//
//  JavaScriptCoreKit.ts
//  java-script-core-kit
//
//  Created by Fang Ling on 2026/9/19.
//
//  This source file is part of the JavaScriptCoreKit open source project
//
//  Copyright (c) 2026 Fang Ling <fangling@fangl.ing>
//  Licensed under Apache License v2.0
//
//  See LICENSE for license information
//
//  SPDX-License-Identifier: Apache-2.0
//
//===----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------===//

import { useAll, WASI } from "uwasi"

import { JavaScriptCoreViewElement } from "./JavaScriptCoreViewElement"

export class JavaScriptCore {
  public static shared = new JavaScriptCore()

  private _wasi: WASI

  private _memory: WebAssembly.Memory

  private _textDecoder: TextDecoder

  private _viewElements: Map<number, JavaScriptCoreViewElement>

  private _exports?: any

  private _touchEvents: Map<number, number>

  public constructor() {
    this._wasi = new WASI({
      features: [
        useAll({
          // Workaround for the error: "Crypto.getRandomValues must be an instance of ArrayBufferView".
          randomFillSync: (buffer) => {
            const chunkSize = Math.max(1, Math.min(buffer.length, 65536))
            const scratch = new Uint8Array(chunkSize)

            for (let offset = 0; offset < buffer.length; offset += chunkSize) {
              const random = scratch.subarray(0, Math.min(chunkSize, buffer.length - offset))

              crypto.getRandomValues(random)
              buffer.set(random, offset)
            }
          }
        })
      ]
    })
    this._memory = new WebAssembly.Memory({
      initial: 587,
      maximum: 16384,
      shared: true
    })
    this._textDecoder = new TextDecoder()
    this._viewElements = new Map().set(JavaScriptCoreViewElement.body.id, JavaScriptCoreViewElement.body)
    this._touchEvents = new Map()

    this._handlePointerDownEvent = this._handlePointerDownEvent.bind(this)
    this._handlePointerMoveEvent = this._handlePointerMoveEvent.bind(this)
    this._handlePointerUpEvent = this._handlePointerUpEvent.bind(this)
    this._handlePointerCancelEvent = this._handlePointerCancelEvent.bind(this)
  }

  public get importedObject() {
    return {
      wasi_snapshot_preview1: this._wasi.wasiImport,
      env: {
        memory: this._memory,
        _JavaScriptCoreGlobalObjectGetWidth: (): number => {
          return window.innerWidth
        },
        _JavaScriptCoreGlobalObjectGetHeight: (): number => {
          return window.innerHeight
        },
        _JavaScriptCoreViewElementInitializeWithKind: (kind: number): number => {
          const viewElement = new JavaScriptCoreViewElement(kind)
          this._viewElements.set(viewElement.id, viewElement)

          return viewElement.id
        },
        _JavaScriptCoreViewElementSetIsKeyViewElement: (id: number, isKeyViewElement: number) => {
          const viewElement = this._viewElements.get(id)

          if (isKeyViewElement !== 0) {
            viewElement?.addEventListener("pointerdown", this._handlePointerDownEvent)
            viewElement?.addEventListener("pointermove", this._handlePointerMoveEvent)
            viewElement?.addEventListener("pointerup", this._handlePointerUpEvent)
            viewElement?.addEventListener("pointercancel", this._handlePointerCancelEvent)
          } else {
            viewElement?.removeEventListener("pointerdown", this._handlePointerDownEvent)
            viewElement?.removeEventListener("pointermove", this._handlePointerMoveEvent)
            viewElement?.removeEventListener("pointerup", this._handlePointerUpEvent)
            viewElement?.removeEventListener("pointercancel", this._handlePointerCancelEvent)
          }
        },
        _JavaScriptCoreViewElementSetClassName: (id: number, buffer: number, count: number) => {
          this._viewElements.get(id)?.setClassName(this.copyUTF8StringFromMemory(buffer, count))
        },
        _JavaScriptCoreViewElementSetStyle: (id: number, property: number, valueBuffer: number, valueBufferCount: number) => {
          this._viewElements.get(id)?.setProperty(property, this.copyUTF8StringFromMemory(valueBuffer, valueBufferCount))
        },
        _JavaScriptCoreViewElementInsertSubviewElementAtIndex: (id: number, subviewElementID: number, index: number) => {
          this._viewElements.get(id)?.insertSubviewElementAtIndex(this._viewElements.get(subviewElementID)!, index)
        },
        _JavaScriptCoreViewElementRemoveFromSuperviewElement: (id: number) => {
          this._viewElements.get(id)?.removeFromSuperviewElement()
        }
      }
    }
  }

  public get wasi() {
    return this._wasi
  }

  public initialize(instance: WebAssembly.Instance) {
    this._wasi.initialize(instance)
    this._exports = instance.exports
  }

  private copyUTF8StringFromMemory(buffer: number, count: number) {
    return this._textDecoder.decode(new Uint8Array(this._memory.buffer, buffer, count))
  }

  private _handlePointerDownEvent(event: PointerEvent) {
    // A view receives a single touch unless it opts into multiple touches, and only the primary mouse button produces a touch.
    if (!event.isPrimary || event.button !== 0 || !(event.target instanceof HTMLElement)) {
      return
    }

    const viewElementID = event.target.closest(`[${JavaScriptCoreViewElement.AttributeName.id}]`)?.getAttribute(JavaScriptCoreViewElement.AttributeName.id)
    if (viewElementID == null) {
      return
    }

    // A touch stays with the view element it began in, even after it moves outside of it.
    this._touchEvents.set(event.pointerId, +viewElementID)

    this._sendTouchEvent(event, JavaScriptCore.TouchPhase.began)
  }

  private _handlePointerMoveEvent(event: PointerEvent) {
    this._sendTouchEvent(event, JavaScriptCore.TouchPhase.moved)
  }

  private _handlePointerUpEvent(event: PointerEvent) {
    this._sendTouchEvent(event, JavaScriptCore.TouchPhase.ended)
  }

  // The browser cancels the pointer when it takes over the gesture, for example to scroll natively.
  private _handlePointerCancelEvent(event: PointerEvent) {
    this._sendTouchEvent(event, JavaScriptCore.TouchPhase.cancelled)
  }

  private _sendTouchEvent(event: PointerEvent, phase: JavaScriptCore.TouchPhase) {
    // Pointers that aren't down, e.g. a hovering mouse, aren't touches.
    const viewElementID = this._touchEvents.get(event.pointerId)
    if (viewElementID === undefined) {
      return
    }

    if (phase === JavaScriptCore.TouchPhase.ended || phase === JavaScriptCore.TouchPhase.cancelled) {
      this._touchEvents.delete(event.pointerId)
    }

    // Report the location in the coordinate space of the key view element, which is where the listeners are installed.
    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()

    this._exports._UIEnqueueTouchEvent(viewElementID, phase, event.clientX - bounds.left, event.clientY - bounds.top)
  }
}

export namespace JavaScriptCore {
  export enum TouchPhase {
    began = 0,
    moved = 1,
    ended = 3,
    cancelled = 4
  }
}
