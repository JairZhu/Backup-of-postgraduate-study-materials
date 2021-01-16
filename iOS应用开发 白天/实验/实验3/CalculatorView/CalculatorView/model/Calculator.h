//
//  Calculator.h
//  CalculatorCMD
//
//  Created by Jairzhu on 20-12-14.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Calculator : NSObject

@property(nonatomic,strong) NSMutableString *str;

-(void)delNumber;
-(void)cleardisp;
-(NSString*)computedResult;

-(NSArray *)validOperator;
-(NSDictionary *)inStackPriority;
-(NSDictionary *)outStackPriority;


-(BOOL)isLegical:(NSString*) str;

-(BOOL)isOperator:(NSString*) str;

-(BOOL)isNumberic:(NSString *)str;


-(NSString *)comparePriority:(NSString *)inOptr outOptr:(NSString *)outOptr;

-(double)calculate:(double)opnd1 opnd2:(double)opnd2 optr:(NSString *)optr;

-(NSString *)ExpressionCalculate:(NSString *)inputString;

@end