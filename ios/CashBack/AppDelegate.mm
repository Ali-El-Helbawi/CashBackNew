#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import <GoogleMaps/GoogleMaps.h>
#import "RNSplashScreen.h"  // here
#import <React/RCTLinkingManager.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyAOX8L2I7L8TVHkYTTndGjILQIh5B-jR7s"]; // add this line using the api key obtained from Google Console
 

  self.moduleName = @"CashBack";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
 
  self.initialProps = @{};
  [FIRApp configure];
//  [super application:application didFinishLaunchingWithOptions:launchOptions];
//  [RNSplashScreen show];
//
//  return YES;
  bool didFinish=[super application:application didFinishLaunchingWithOptions:launchOptions];
  
  [RNSplashScreen show];  // here
  return didFinish;
}
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}
 
- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
