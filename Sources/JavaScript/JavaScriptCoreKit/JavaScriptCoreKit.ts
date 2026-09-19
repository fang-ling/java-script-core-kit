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

  private copyUTF8StringFromMemory(buffer: number, count: number) {
    return this._textDecoder.decode(new Uint8Array(this._memory.buffer, buffer, count))
  }
}
