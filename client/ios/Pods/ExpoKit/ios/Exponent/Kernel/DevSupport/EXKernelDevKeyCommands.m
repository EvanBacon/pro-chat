// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXEnvironment.h"
#import "EXKernelDevKeyCommands.h"
#import "EXKernel.h"
#import "EXKernelAppRegistry.h"
#import "EXReactAppManager.h"

#import <React/RCTDefines.h>
#import <React/RCTUtils.h>

#import <UIKit/UIKit.h>

NSNotificationName kEXKernelDidChangeMenuBehaviorNotification = @"EXKernelDidChangeMenuBehaviorNotification";

@interface EXKeyCommand : NSObject <NSCopying>

@property (nonatomic, strong) UIKeyCommand *keyCommand;
@property (nonatomic, copy) void (^block)(UIKeyCommand *);

@end

@implementation EXKeyCommand

- (instancetype)initWithKeyCommand:(UIKeyCommand *)keyCommand
                             block:(void (^)(UIKeyCommand *))block
{
  if ((self = [super init])) {
    _keyCommand = keyCommand;
    _block = block;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (id)copyWithZone:(__unused NSZone *)zone
{
  return self;
}

- (NSUInteger)hash
{
  return _keyCommand.input.hash ^ _keyCommand.modifierFlags;
}

- (BOOL)isEqual:(EXKeyCommand *)object
{
  if (![object isKindOfClass:[EXKeyCommand class]]) {
    return NO;
  }
  return [self matchesInput:object.keyCommand.input
                      flags:object.keyCommand.modifierFlags];
}

- (BOOL)matchesInput:(NSString *)input flags:(UIKeyModifierFlags)flags
{
  return [_keyCommand.input isEqual:input] && _keyCommand.modifierFlags == flags;
}

- (NSString *)description
{
  return [NSString stringWithFormat:@"<%@:%p input=\"%@\" flags=%zd hasBlock=%@>",
          [self class], self, _keyCommand.input, _keyCommand.modifierFlags,
          _block ? @"YES" : @"NO"];
}

@end

@interface EXKernelDevKeyCommands ()

@property (nonatomic, strong) NSMutableSet<EXKeyCommand *> *commands;

@end

@implementation UIResponder (EXKeyCommands)

- (NSArray<UIKeyCommand *> *)EX_keyCommands
{
  NSSet<EXKeyCommand *> *commands = [EXKernelDevKeyCommands sharedInstance].commands;
  return [[commands valueForKeyPath:@"keyCommand"] allObjects];
}

- (void)EX_handleKeyCommand:(UIKeyCommand *)key
{
  // NOTE: throttle the key handler because on iOS 9 the handleKeyCommand:
  // method gets called repeatedly if the command key is held down.
  static NSTimeInterval lastCommand = 0;
  if (CACurrentMediaTime() - lastCommand > 0.5) {
    for (EXKeyCommand *command in [EXKernelDevKeyCommands sharedInstance].commands) {
      if ([command.keyCommand.input isEqualToString:key.input] &&
          command.keyCommand.modifierFlags == key.modifierFlags) {
        if (command.block) {
          command.block(key);
          lastCommand = CACurrentMediaTime();
        }
      }
    }
  }
}

@end

@implementation EXKernelDevKeyCommands

+ (instancetype)sharedInstance
{
  static EXKernelDevKeyCommands *instance;
  static dispatch_once_t once;
  dispatch_once(&once, ^{
    if (!instance) {
      instance = [[EXKernelDevKeyCommands alloc] init];
    }
  });
  return instance;
}

+ (void)initialize
{
  // capture keycommands across all bridges.
  // this is the same approach taken by RCTKeyCommands,
  // but that class is disabled in the expo react native fork
  // since there may be many instances of it.
  RCTSwapInstanceMethods([UIResponder class],
                         @selector(keyCommands),
                         @selector(EX_keyCommands));
}

- (instancetype)init
{
  if ((self = [super init])) {
    _commands = [NSMutableSet set];
    _isLegacyMenuBehaviorEnabled = NO;
    [self _addDevCommands];
  }
  return self;
}

- (void)setIsLegacyMenuBehaviorEnabled:(BOOL)isLegacyMenuBehaviorEnabled
{
  _isLegacyMenuBehaviorEnabled = isLegacyMenuBehaviorEnabled;
  [[NSNotificationCenter defaultCenter] postNotificationName:kEXKernelDidChangeMenuBehaviorNotification object:nil];
}

- (BOOL)isLegacyMenuButtonAvailable
{
    BOOL isSimulator = NO;
#if TARGET_OS_SIMULATOR
    isSimulator = YES;
#endif
  return (
    isSimulator
    && _isLegacyMenuBehaviorEnabled
    && [EXKernel sharedInstance].appRegistry.appEnumerator.allObjects.count > 0
  );
}

#pragma mark - expo dev commands

- (void)_addDevCommands
{
  __weak typeof(self) weakSelf = self;
  [self registerKeyCommandWithInput:@"d"
                      modifierFlags:UIKeyModifierCommand
                             action:^(__unused UIKeyCommand *_) {
                               [weakSelf _handleMenuCommand];
                             }];
  [self registerKeyCommandWithInput:@"r"
                      modifierFlags:UIKeyModifierCommand
                             action:^(__unused UIKeyCommand *_) {
                               [weakSelf _handleRefreshCommand];
                             }];
  [self registerKeyCommandWithInput:@"n"
                      modifierFlags:UIKeyModifierCommand
                             action:^(__unused UIKeyCommand *_) {
                               [weakSelf _handleDisableDebuggingCommand];
                             }];
  [self registerKeyCommandWithInput:@"i"
                      modifierFlags:UIKeyModifierCommand
                             action:^(__unused UIKeyCommand *_) {
                               [weakSelf _handleToggleInspectorCommand];
                             }];
  [self registerKeyCommandWithInput:@"k"
                      modifierFlags:UIKeyModifierCommand | UIKeyModifierControl
                             action:^(__unused UIKeyCommand *_) {
                               [weakSelf _handleKernelMenuCommand];
                             }];
}

- (void)_handleMenuCommand
{
  if ([EXEnvironment sharedEnvironment].isDetached || _isLegacyMenuBehaviorEnabled) {
    [[EXKernel sharedInstance].visibleApp.appManager showDevMenu];
  } else {
    [[EXKernel sharedInstance] switchTasks];
  }
}

- (void)_handleRefreshCommand
{
  [[EXKernel sharedInstance].visibleApp.appManager reloadBridge];
}

- (void)_handleDisableDebuggingCommand
{
  [[EXKernel sharedInstance].visibleApp.appManager disableRemoteDebugging];
}

- (void)_handleToggleInspectorCommand
{
  [[EXKernel sharedInstance].visibleApp.appManager toggleElementInspector];
}

- (void)_handleKernelMenuCommand
{
  if ([EXKernel sharedInstance].visibleApp == [EXKernel sharedInstance].appRegistry.homeAppRecord) {
    [[EXKernel sharedInstance].appRegistry.homeAppRecord.appManager showDevMenu];
  }
}

#pragma mark - managing list of commands

- (void)registerKeyCommandWithInput:(NSString *)input
                      modifierFlags:(UIKeyModifierFlags)flags
                             action:(void (^)(UIKeyCommand *))block
{
  RCTAssertMainQueue();
  
  UIKeyCommand *command = [UIKeyCommand keyCommandWithInput:input
                                              modifierFlags:flags
                                                     action:@selector(EX_handleKeyCommand:)];
  
  EXKeyCommand *keyCommand = [[EXKeyCommand alloc] initWithKeyCommand:command block:block];
  [_commands removeObject:keyCommand];
  [_commands addObject:keyCommand];
}

- (void)unregisterKeyCommandWithInput:(NSString *)input
                        modifierFlags:(UIKeyModifierFlags)flags
{
  RCTAssertMainQueue();
  
  for (EXKeyCommand *command in _commands.allObjects) {
    if ([command matchesInput:input flags:flags]) {
      [_commands removeObject:command];
      break;
    }
  }
}

- (BOOL)isKeyCommandRegisteredForInput:(NSString *)input
                         modifierFlags:(UIKeyModifierFlags)flags
{
  RCTAssertMainQueue();
  
  for (EXKeyCommand *command in _commands) {
    if ([command matchesInput:input flags:flags]) {
      return YES;
    }
  }
  return NO;
}

@end

