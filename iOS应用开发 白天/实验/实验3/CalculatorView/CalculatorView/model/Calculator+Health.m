//
//  Calculator+Health.m
//  CalculatorView
//
//  Created by Jairzhu on 20-12-29.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "Calculator+Health.h"

@implementation Calculator (Health)
-(NSString*) computeHealthWithHeight:(NSString *)height andWeight:(NSString *)weight {
    NSMutableString *expression = [NSMutableString stringWithString:weight];
    [expression appendString:@"/(("];
    [expression appendString:height];
    [expression appendString:@"/100.0)"];
    [expression appendString:@"*("];
    [expression appendString:height];
    [expression appendString:@"/100.0))"];
    self.str = expression;
    return [NSString stringWithFormat:@"%.2f", [[self computedResult] floatValue]];
}
@end
