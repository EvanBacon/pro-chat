/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/UIView+React.h>
#import "RNSVGCGFCRule.h"
#import "RNSVGSvgView.h"
@class RNSVGGroup;

/**
 * RNSVG nodes are implemented as base UIViews. They should be implementation for all basic
 ＊interfaces for all non-defination nodes.
 */

@interface RNSVGNode : UIView

/*
 N[1/Sqrt[2], 36]
 The inverse of the square root of 2.
 Provide enough digits for the 128-bit IEEE quad (36 significant digits).
 */
extern CGFloat const M_SQRT1_2l;
extern CGFloat const RNSVG_DEFAULT_FONT_SIZE;

@property (nonatomic, strong) NSString *name;
@property (nonatomic, assign) CGFloat opacity;
@property (nonatomic, assign) RNSVGCGFCRule clipRule;
@property (nonatomic, strong) NSString *clipPath;
@property (nonatomic, assign) BOOL responsible;
@property (nonatomic, assign) CGAffineTransform matrix;
@property (nonatomic, assign) BOOL active;

- (void)invalidate;

- (RNSVGGroup *)getTextRoot;
- (RNSVGGroup *)getParentTextRoot;

- (void)renderTo:(CGContextRef)context;

/**
 * renderTo will take opacity into account and draw renderLayerTo off-screen if there is opacity
 * specified, then composite that onto the context. renderLayerTo always draws at opacity=1.
 * @abstract
 */
- (void)renderLayerTo:(CGContextRef)context;

/**
 * get clipPath from cache
 */
- (CGPathRef)getClipPath;

/**
 * get clipPath through context
 */
- (CGPathRef)getClipPath:(CGContextRef)context;

/**
 * clip node by clipPath
 */
- (void)clip:(CGContextRef)context;

/**
 * getPath will return the path inside node as a ClipPath.
 */
- (CGPathRef)getPath:(CGContextRef) context;

/**
 * run hitTest
 */
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event withTransform:(CGAffineTransform)transfrom;

/**
 * get RNSVGSvgView which ownes current RNSVGNode
 */
- (RNSVGSvgView *)getSvgView;

- (CGFloat)relativeOnWidth:(NSString *)length;

- (CGFloat)relativeOnHeight:(NSString *)length;

- (CGFloat)relativeOnOther:(NSString *)length;

- (CGFloat)getFontSizeFromContext;

- (CGFloat)getContextWidth;

- (CGFloat)getContextHeight;

- (CGFloat)getContextLeft;

- (CGFloat)getContextTop;

/**
 * save element`s reference into svg element.
 */
- (void)parseReference;

- (void)beginTransparencyLayer:(CGContextRef)context;

- (void)endTransparencyLayer:(CGContextRef)context;

- (void)traverseSubviews:(BOOL (^)(__kindof RNSVGNode *node))block;

@end
