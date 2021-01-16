//
//  HelloWorld.m
//  test
//
//  Created by Jairzhu on 20-12-14.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "HelloWorld.h"

@interface HelloWorld() {}
@end

@implementation HelloWorld
@synthesize something = _something;

- (void) setSomething:(NSString *)something {
    NSMutableString *mstr = [NSMutableString stringWithString:something];
    _something = mstr;
}

- (NSString*) something {
    return _something;
}

- (void) sayHello:(NSString *)greeting {
    NSMutableString *mstr = [NSMutableString stringWithString:@"hello "];
    [mstr appendString:greeting];
    NSLog(@"%@", mstr);
    
}

- (void) saySomething {
    NSLog(@"%@", _something);
}

+(void) sayHelloWorld {
    NSLog(@"hello ios world");
}

@end