//
//  Stack.m
//  CalculatorCMD
//
//  Created by Jairzhu on 20-12-14.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "Stack.h"

@implementation Stack
//常量实现
NSUInteger const size = 500;

//带参数的构造方法
-(instancetype)initWithSize:(NSUInteger)size{
    self = [super init];
    if(self){
        self.stackArray = [[NSMutableArray alloc]initWithCapacity:size];
        for(NSUInteger i = 0;i<size;i++){
            [self.stackArray addObject:@"#"];
        }
    }
    return self;
}
//获取栈顶元素
-(NSString*)getTop{
    if(self.stackArray.count == 0){
        NSLog(@"Stack is Empty.");
        return nil;
    }
    else
        return self.top;
}
//入栈
-(BOOL)push:(NSString*) element{
    if(self.stackArray.count == size){
        NSLog(@"Stack is full, fail to push.");
        return NO;
    }
    else{
        [self.stackArray addObject:element];
        self.top = [self.stackArray lastObject];
        return YES;
    }
}
//出栈
-(NSString*)pop{
    if(self.stackArray.count == 0){
        NSLog(@"Stack is empty, fail to pop.");
        return nil;
    }
    else{
        NSString* popElement = [self.stackArray lastObject];
        [self.stackArray removeLastObject];
        self.top = [self.stackArray lastObject];
        return popElement;
    }
}
@end