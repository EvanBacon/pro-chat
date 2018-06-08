// Copyright 2015-present 650 Industries. All rights reserved.

#import "AppDelegate.h"
#import "ExpoKit.h"
#import "EXViewController.h"
#import <Firebase.h> /// Import this thing

@interface AppDelegate ()

@property (nonatomic, strong) EXViewController *rootViewController;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [FIRApp configure]; /// Add this at the beginning of the function

    _window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    _window.backgroundColor = [UIColor whiteColor];
    [[ExpoKit sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
    _rootViewController = [ExpoKit sharedInstance].rootViewController;
    _window.rootViewController = _rootViewController;

    [_window makeKeyAndVisible];
    
    return YES;
}

#pragma mark - Handling URLs

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(id)annotation
{
    return [[ExpoKit sharedInstance] application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
    
    /*
     // FBSDK
     return [[FBSDKApplicationDelegate sharedInstance] application:application
     openURL:url
     sourceApplication:sourceApplication
     annotation:annotation];
     */
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray * _Nullable))restorationHandler
{
    return [[ExpoKit sharedInstance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

#pragma mark - Notifications

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)token
{
    [[ExpoKit sharedInstance] application:application didRegisterForRemoteNotificationsWithDeviceToken:token];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)err
{
    [[ExpoKit sharedInstance] application:application didFailToRegisterForRemoteNotificationsWithError:err];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
    [[ExpoKit sharedInstance] application:application didReceiveRemoteNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(nonnull UILocalNotification *)notification
{
    [[ExpoKit sharedInstance] application:application didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(nonnull UIUserNotificationSettings *)notificationSettings
{
    [[ExpoKit sharedInstance] application:application didRegisterUserNotificationSettings:notificationSettings];
}

#pragma mark - RNFBMessages

/*
 -(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
 [RNFirebaseMessaging didReceiveLocalNotification:notification];
 }
 
 - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo {
 [RNFirebaseMessaging didReceiveRemoteNotification:userInfo];
 }
 
 - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
 fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
 [RNFirebaseMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
 }
 
 - (void)userNotificationCenter:(UNUserNotificationCenter *)center
 willPresentNotification:(UNNotification *)notification
 withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
 [RNFirebaseMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
 }
 
 - (void)userNotificationCenter:(UNUserNotificationCenter *)center
 didReceiveNotificationResponse:(UNNotificationResponse *)response
 withCompletionHandler:(void (^)())completionHandler {
 [RNFirebaseMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
 }

 */

#pragma mark - FBSDK
/*
 - (BOOL)application:(UIApplication *)application
 openURL:(NSURL *)url
 options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
 
 BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
 openURL:url
 sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
 annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
 ];
 // Add any custom logic here.
 return handled;
 }
 
 - (void)applicationDidBecomeActive:(UIApplication *)application {
 [FBSDKAppEvents activateApp];
 }

 */

@end
