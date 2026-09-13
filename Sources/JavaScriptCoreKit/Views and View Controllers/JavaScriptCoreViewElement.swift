//===----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------===//
//
//  JavaScriptCoreViewElement.swift
//  java-script-core-kit
//
//  Created by Fang Ling on 2026/7/11.
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

/// A representation of a DOM node.
///
/// ## Topics
///
/// ### Creating a View Element
///
/// - ``init()``
///
/// ### Accessing properties of a View Element
///
/// - ``className``
/// - ``style``
/// - ``JavaScriptCoreViewElement/Style``
///
/// ### Managing the View Element hierarchy
///
/// - ``subviewElements``
/// - ``superviewElement``
/// - ``addSubviewElement(_:)``
/// - ``insertSubviewElement(_:at:)``
/// - ``removeFromSuperviewElement()``
public class JavaScriptCoreViewElement {
  internal class var _viewElementKind: JavaScriptCoreViewElement._Kind {
    return .division
  }

  private var _id: CInteger

  /// A string containing the element's class name.
  public var className: FoundationString? {
    didSet {
      if let className {
        _JavaScriptCoreViewElementSetClassName(for: self._id, className.utf8.cString, className.utf8.count)
      }
    }
  }

  /// The style applied to an element.
  public var style: Style {
    didSet {
      var entries: FoundationArray<(Style._Property, FoundationString)> = []

      if let width = style.width {
        entries.append((.width, "\(width)px"))
      }
      if let height = style.height {
        entries.append((.height, "\(height)px"))
      }
      if let left = style.left {
        entries.append((.left, "\(left)px"))
      }
      if let top = style.top {
        entries.append((.top, "\(top)px"))
      }
      if let visibility = style.visibility {
        entries.append((.visibility, visibility))
      }
      if let borderRadius = style.borderRadius {
        entries.append((.borderRadius, "\(borderRadius)px"))
      }
      if let overflow = style.overflow {
        entries.append((.overflow, overflow))
      }

      for entry in entries {
        _JavaScriptCoreViewElementSetStyle(for: self._id, entry.0.rawValue, entry.1.utf8.cString, entry.1.utf8.count)
      }
    }
  }

  /// An array containing the child elements of the element currently being accessed.
  public var subviewElements: FoundationArray<JavaScriptCoreViewElement>?

  /// The parent view element of the view element.
  public weak var superviewElement: JavaScriptCoreViewElement?

  /// Creates a new view element.
  public required init() {
    self._id = _JavaScriptCoreViewElementInitialize(with: Swift::type(of: self)._viewElementKind.rawValue)
    self.style = Style()
  }

  /// Appends the view element to the view element's list of ``subviewElements``.
  ///
  /// If the array in the ``subviewElements`` property is `nil`, calling this method creates an array for that property and adds the specified view element to it.
  ///
  /// - Parameter viewElement: The view element to be added.
  public func addSubviewElement(_ viewElement: JavaScriptCoreViewElement) {
    if self.subviewElements == nil {
      self.subviewElements = []
    }

    self.insertSubviewElement(viewElement, at: self.subviewElements!.count)
  }

  /// Inserts the specified view element into the view element's list of ``subviewElements`` at the specified index.
  ///
  /// - Parameters:
  ///   - viewElement: The view element to be inserted into the current view element.
  ///   - index: The index at which to insert `viewElement`. This value must be a valid 0-based index into the ``subviewElements`` array.
  public func insertSubviewElement(_ viewElement: JavaScriptCoreViewElement, at index: CInteger) {
    if viewElement.superviewElement !== self {
      viewElement.removeFromSuperviewElement()
    }

    self.subviewElements?.insert(viewElement, at: index)

    viewElement.superviewElement = self

    _JavaScriptCoreViewElementInsertSubviewElementAtIndex(for: self._id, viewElement._id, at: index)
  }

  /// Detaches the view element from its parent view element.
  ///
  /// You can use this method to remove a view element (and all of its children) from a view element hierarchy. This method updates both the ``superviewElement``'s list of ``subviewElements`` and sets
  /// this view element's ``superviewElement`` property to `nil`.
  public func removeFromSuperviewElement() {
    guard self.superviewElement != nil else {
      return
    }

    self.superviewElement?.subviewElements?.removeAll(where: { $0 === self })

    self.superviewElement = nil

    _JavaScriptCoreViewElementRemoveFromSuperviewElement(for: self._id)
  }
}

@_extern(wasm, module: "env", name: "_JavaScriptCoreViewElementInitializeWithKind")
private func _JavaScriptCoreViewElementInitialize(with kind: CInteger) -> CInteger

@_extern(wasm, module: "env", name: "_JavaScriptCoreViewElementSetClassName")
private func _JavaScriptCoreViewElementSetClassName(for viewElementID: CInteger, _ buffer: CString, _ count: CInteger)

@_extern(wasm, module: "env", name: "_JavaScriptCoreViewElementSetStyle")
private func _JavaScriptCoreViewElementSetStyle(for viewElementID: CInteger, _ property: CInteger, _ valueBuffer: CString, _ valueBufferCount: CInteger)

@_extern(wasm, module: "env", name: "_JavaScriptCoreViewElementInsertSubviewElementAtIndex")
private func _JavaScriptCoreViewElementInsertSubviewElementAtIndex(for viewElementID: CInteger, _ subviewElementID: CInteger, at index: CInteger)

@_extern(wasm, module: "env", name: "_JavaScriptCoreViewElementRemoveFromSuperviewElement")
private func _JavaScriptCoreViewElementRemoveFromSuperviewElement(for viewElementID: CInteger)
