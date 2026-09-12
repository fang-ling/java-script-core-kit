//===----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------===//
//
//  JavaScriptCoreGlobalObject.swift
//  java-script-core-kit
//
//  Created by Fang Ling on 2026/7/4.
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

import CKit

/// An object that bridges the UI, navigation stack, storage, and event handling from JavaScript.
///
/// ## Topics
///
/// ### Obtaining a Global Object
///
/// - ``default``
///
/// ### Accessing the Height and Width of a Window
///
/// - ``width``
/// - ``height``
public final class JavaScriptCoreGlobalObject: Swift::Sendable {
  /// The shared global object for the process.
  public static let `default` = JavaScriptCoreGlobalObject()

  /// The interior width of the window in pixels (that is, the width of the window's layout viewport).
  public var width: CFloatingPoint64 {
    return _JavaScriptCoreGlobalObjectGetWidth()
  }

  /// The interior height of the window in pixels (that is, the height of the window's layout viewport).
  public var height: CFloatingPoint64 {
    return _JavaScriptCoreGlobalObjectGetHeight()
  }
}

@_extern(wasm, module: "env", name: "_JavaScriptCoreGlobalObjectGetWidth")
private func _JavaScriptCoreGlobalObjectGetWidth() -> CFloatingPoint64

@_extern(wasm, module: "env", name: "_JavaScriptCoreGlobalObjectGetHeight")
private func _JavaScriptCoreGlobalObjectGetHeight() -> CFloatingPoint64
