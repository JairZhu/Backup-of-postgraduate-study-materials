//
//  main.m
//  test
//
//  Created by Jairzhu on 20-12-8.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "HelloWorld.h"


int main(int argc, const char * argv[]) {
    @autoreleasepool {
        [HelloWorld sayHelloWorld];
        HelloWorld* helloworld = [[HelloWorld alloc] init];
        helloworld.something = @"ios";
        [helloworld saySomething];
        [helloworld sayHello:@"IOS world"];
    }
    return 0;
}
