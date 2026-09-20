/*
 *  JavaScriptCoreNode.m
 *  javascript-core-kit
 *
 *  Created by Fang Ling on 2026/7/11.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and limitations under the License.
 */

#import "JavaScriptCoreNode.h"

#import <FoundationKit/FoundationKit.h>

extern CUnsignedInteger32 JavaScriptCoreNodeInitializeWithType(CInteger type);

extern void JavaScriptCoreNodeSetClassName(CUnsignedInteger32 nodeID, CInteger32* classNameBuffer, CInteger classNameBufferCount);

extern void JavaScriptCoreNodeSetSourceContent(CUnsignedInteger32 nodeID, CInteger32* sourceContentBuffer, CInteger sourceContentBufferCount);

extern void JavaScriptCoreNodeSetStyleProperty(CUnsignedInteger32 nodeID,
                                               CInteger32* propertyBuffer,
                                               CUnsignedInteger64 propertyBufferCount,
                                               CInteger32* valueBuffer,
                                               CUnsignedInteger64 valueBufferCount);

extern void JavaScriptCoreNodeSetTextContent(CUnsignedInteger32 nodeID, CInteger32* textContentBuffer, CUnsignedInteger64 textContentBufferCount);

extern void JavaScriptCoreNodeAddEventListener(CUnsignedInteger32 nodeID, CInteger type);

extern void JavaScriptCoreNodeRemoveEventListener(CUnsignedInteger32 nodeID, CInteger type);

extern void JavaScriptCoreNodeAddSubnode(CUnsignedInteger32 nodeID, CUnsignedInteger32 subnodeID);

extern void JavaScriptCoreNodeInsertSubnodeAtIndex(CUnsignedInteger32 nodeID, CUnsignedInteger32 subnodeID, CInteger index);

extern void JavaScriptCoreNodeRemoveFromSupernode(CUnsignedInteger32 supernodeID, CUnsignedInteger32 nodeID);

static let documentNode = (JavaScriptCoreNode*)nil;

@interface JavaScriptCoreNode ()

@property (nonatomic, readwrite) CUnsignedInteger32 id;

@property (nullable, nonatomic) JavaScriptCoreNode* supernode;

@property (nonatomic) FoundationMutableArray<JavaScriptCoreNode*>* subnodes;

@end

@implementation JavaScriptCoreNode

+ (void)initialize {
  documentNode = [[JavaScriptCoreNode alloc] init];
  documentNode.id = 0;
}

+ (instancetype)documentNode {
  return documentNode;
}

- (instancetype)initWithType:(JavaScriptCoreNodeType)type {
  if (!(self = [super init])) {
    return nil;
  }

  self.id = JavaScriptCoreNodeInitializeWithType(type);

  return self;
}

- (void)setClassName:(FoundationString*)className {
  let classNameBuffer = (CInteger32*)CMemoryAllocate(className.count, sizeof(CInteger32));
  [className copyCharacters:classNameBuffer];

  JavaScriptCoreNodeSetClassName(self.id, classNameBuffer, className.count);

  CMemoryDeallocate(classNameBuffer);
}

- (void)setSourceContent:(FoundationString*)sourceContent {
  let sourceContentBuffer = (CInteger32*)CMemoryAllocate(sourceContent.count, sizeof(CInteger32));
  [sourceContent copyCharacters:sourceContentBuffer];

  JavaScriptCoreNodeSetSourceContent(self.id, sourceContentBuffer, sourceContent.count);

  CMemoryDeallocate(sourceContentBuffer);
}

- (void)setStyleValue:(FoundationString*)value forProperty:(FoundationString*)property {
  let propertyBuffer = (CInteger32*)CMemoryAllocate(property.count, sizeof(CInteger32));
  let valueBuffer = (CInteger32*)CMemoryAllocate(value.count, sizeof(CInteger32));
  [property copyCharacters:propertyBuffer];
  [value copyCharacters:valueBuffer];

  JavaScriptCoreNodeSetStyleProperty(self.id, propertyBuffer, property.count, valueBuffer, value.count);

  CMemoryDeallocate(propertyBuffer);
  CMemoryDeallocate(valueBuffer);
}

- (void)setTextContent:(FoundationString*)textContent {
  let textContentBuffer = (CInteger32*)CMemoryAllocate(textContent.count, sizeof(CInteger32));
  [textContent copyCharacters:textContentBuffer];

  JavaScriptCoreNodeSetTextContent(self.id, textContentBuffer, textContent.count);

  CMemoryDeallocate(textContentBuffer);
}

- (void)addEventListenerWithType:(JavaScriptCoreNodeEventType)eventType {
  JavaScriptCoreNodeAddEventListener(self.id, eventType);
}

- (void)removeEventListenerWithType:(JavaScriptCoreNodeEventType)eventType {
  JavaScriptCoreNodeRemoveEventListener(self.id, eventType);
}

- (void)addSubnode:(JavaScriptCoreNode*)node {
  if (self.subnodes == nil) {
    self.subnodes = [FoundationMutableArray makeArray];
  }

  if (node.supernode != self) {
    [node removeFromSupernode];
  }

  [self.subnodes appendObject:node];

  node.supernode = self;

  JavaScriptCoreNodeAddSubnode(self.id, node.id);
}

- (void)insertSubnode:(JavaScriptCoreNode*)node atIndex:(CInteger)index {
  if (self.subnodes == nil) {
    self.subnodes = [FoundationMutableArray makeArray];
  }

  if (node.supernode != self) {
    [node removeFromSupernode];
  }

  [self.subnodes insertObject:node atIndex:index];

  node.supernode = self;

  JavaScriptCoreNodeInsertSubnodeAtIndex(self.id, node.id, index);
}

- (void)removeFromSupernode {
  if (self.supernode == nil) {
    return;
  }

  JavaScriptCoreNodeRemoveFromSupernode(self.supernode.id, self.id);

  [self.supernode.subnodes removeAllObjectsWhere:^CBoolean(JavaScriptCoreNode* node) {
    return [node isEqual:self];
  }];

  self.supernode = nil;
}

@end
