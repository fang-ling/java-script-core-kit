//===----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------===//
//
//  JavaScriptCoreViewElement.ts
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

export class JavaScriptCoreViewElement {
  private static _index = 0

  private static _body: JavaScriptCoreViewElement

  public static get body() {
    if (!this._body) {
      this._body = new JavaScriptCoreViewElement()
    }

    return this._body
  }

  private _element: HTMLElement

  public id: number

  public constructor(kind?: JavaScriptCoreViewElement.Kind) {
    if (kind === undefined) {
      this.id = -1
      this._element = document.body

      return
    }

    this.id = JavaScriptCoreViewElement._index
    JavaScriptCoreViewElement._index += 1

    const type = (() => {
      switch (kind) {
        case JavaScriptCoreViewElement.Kind.division: return "div"
      }
    })()

    this._element = document.createElement(type)
    this._element.className = "view"
  }

  public setClassName(className: string) {
    this._element.className = className
  }

  public setProperty(property: JavaScriptCoreViewElement.Property, value: string) {
    const propertyString = (() => {
      switch (property) {
        case JavaScriptCoreViewElement.Property.width: return "width"
        case JavaScriptCoreViewElement.Property.height: return "height"
        case JavaScriptCoreViewElement.Property.left: return "left"
        case JavaScriptCoreViewElement.Property.top: return "top"
        case JavaScriptCoreViewElement.Property.visibility: return "visibility"
        case JavaScriptCoreViewElement.Property.borderRadius: return "border-radius"
        case JavaScriptCoreViewElement.Property.overflow: return "overflow"
      }
    })()

    this._element.style.setProperty(propertyString, value)
  }

  public insertSubviewElementAtIndex(subviewElement: JavaScriptCoreViewElement, index: number) {
    this._element.insertBefore(subviewElement._element, this._element.childNodes[index]!)
  }

  public removeFromSuperviewElement() {
    this._element.parentNode?.removeChild(this._element)
  }
}

export namespace JavaScriptCoreViewElement {
  export enum Kind {
    division = 1
  }

  export enum Property {
    width = 1,
    height = 2,
    left = 3,
    top = 4,
    visibility = 5,
    borderRadius = 6,
    overflow = 7
  }
}
