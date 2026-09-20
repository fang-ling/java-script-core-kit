//===----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------===//
//
//  JavaScriptCoreViewElement+Style.swift
//  java-script-core-kit
//
//  Created by Fang Ling on 2026/9/6.
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
import FoundationKit

extension JavaScriptCoreViewElement {
  /// A style applied to a view element.
  ///
  /// ## Topics
  ///
  /// ### Defining the Height and Width of an Element
  ///
  /// - ``width``
  /// - ``height``
  ///
  /// ### Aligning and Positioning an Element
  ///
  /// - ``top``
  /// - ``left``
  ///
  /// ### Showing and Hiding an Element
  ///
  /// - ``visibility``
  ///
  /// ### Configuring an Element's borders
  ///
  /// - ``borderRadius``
  ///
  /// ### Configuring Overflow Behavior of an Element
  ///
  /// - ``overflow``
  public struct Style {
    /// The width, in pixels, for an element.
    public var width: CFloatingPoint64?

    /// The height, in pixels, for an element.
    public var height: CFloatingPoint64?

    /// The horizontal position, in pixels, for an element.
    public var left: CFloatingPoint64?

    /// The vertical position, in pixels, for an element.
    public var top: CFloatingPoint64?

    /// The property shows or hides an element.
    public var visibility: FoundationString?

    /// The property rounds the corners of an element's outer border edge.
    public var borderRadius: CFloatingPoint64?

    /// The property for controlling how an element handles content that is too large for the container.
    public var overflow: FoundationString?
  }
}

extension JavaScriptCoreViewElement.Style {
  internal enum _Property: CInteger {
    case width = 1
    case height = 2
    case left = 3
    case top = 4
    case visibility = 5
    case borderRadius = 6
    case overflow = 7
  }
}
