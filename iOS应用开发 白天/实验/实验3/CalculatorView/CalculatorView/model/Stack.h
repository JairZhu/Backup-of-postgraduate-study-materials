//
//  Stack.h
//  CalculatorCMD
//
//  Created by Jairzhu on 20-12-14.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//


#import <Foundation/Foundation.h>

@interface Stack : NSObject

//参数
extern NSUInteger const size;         //栈最大容量（常量）
@property(nonatomic, retain) NSMutableArray *stackArray;    //栈内元素
@property(nonatomic, retain) NSString *top;                    //栈顶元素


-(instancetype)initWithSize:(NSUInteger) size;

-(NSString*)getTop;

-(BOOL)push:(NSString*) element;

-(NSString*)pop;

@end
