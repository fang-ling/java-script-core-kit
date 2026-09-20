// swift-tools-version: 6.3

//===----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------===//
//
//  Package.swift
//  java-script-core-kit
//
//  Created by Fang Ling on 2026/4/4.
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

import PackageDescription

let isDevelopment = false

let dependencies = [
  ("c-kit", "CKit", "main"),
  ("foundation-kit", "FoundationKit", "main")
]

let package = Package(
  name: "java-script-core-kit",
  products: [
    .library(name: "JavaScriptCoreKit", targets: ["JavaScriptCoreKit"])
  ],
  dependencies: dependencies.map { isDevelopment ? .package(path: "../\($0.0)") : .package(url: "https://github.com/fang-ling/\($0.0)", branch: $0.2) },
  targets: [
    .target(
      name: "JavaScriptCoreKit",
      dependencies: dependencies.map { .product(name: $0.1, package: $0.0) },
      swiftSettings: [
        .enableExperimentalFeature("Extern")
      ]
    )
  ]
)
