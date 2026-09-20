/*
 *  JavaScriptCoreNode.h
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

#import <CKit/CKit.h>
#import <ObjectiveCKit/ObjectiveCKit.h>

C_ASSUME_NONNULL_BEGIN

typedef enum JavaScriptCoreNodeType {
  kJavaScriptCoreNodeTypeButton = 0,
  kJavaScriptCoreNodeTypeDivision = 1,
  kJavaScriptCoreNodeTypeImage = 2,
  kJavaScriptCoreNodeTypeParagraph = 3,
  kJavaScriptCoreNodeTypeSpan = 4
} JavaScriptCoreNodeType;

typedef enum JavaScriptCoreNodeEventType { kJavaScriptCoreNodeEventTypeClick = 1, kJavaScriptCoreNodeEventTypeScroll = 16384 } JavaScriptCoreNodeEventType;

@interface JavaScriptCoreNode: ObjectiveCObject

@property (class, nonatomic, readonly) JavaScriptCoreNode* documentNode;

@property (nonatomic, readonly) CUnsignedInteger32 id;

- (instancetype)initWithType:(JavaScriptCoreNodeType)type;

- (void)setClassName:(FoundationString*)className;

- (void)setSourceContent:(FoundationString*)sourceContent;

- (void)setStyleValue:(FoundationString*)value forProperty:(FoundationString*)property;

- (void)setTextContent:(FoundationString*)textContent;

- (void)addEventListenerWithType:(JavaScriptCoreNodeEventType)eventType;

- (void)removeEventListenerWithType:(JavaScriptCoreNodeEventType)eventType;

- (void)addSubnode:(JavaScriptCoreNode*)node;

- (void)insertSubnode:(JavaScriptCoreNode*)node atIndex:(CInteger)index;

- (void)removeFromSupernode;

@end

C_ASSUME_NONNULL_END
