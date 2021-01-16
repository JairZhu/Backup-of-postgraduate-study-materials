//
//  HelloWorld.h
//  test
//
//  Created by Jairzhu on 20-12-8.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//


#import <Foundation/Foundation.h>

@interface HelloWorld: NSObject
@property (strong, nonatomic) NSString* something;
+ (void) sayHelloWorld;
- (void) sayHello:(NSString*) greeting;
- (void) saySomething;

@end