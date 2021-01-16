//
//  advancedCalculator.h
//  CalculatorView
//
//  Created by Jairzhu on 20-12-29.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "Calculator.h"
#import <math.h>

@interface advancedCalculator : Calculator
-(NSString*) sqrt:(NSString*)content;
-(NSString *)abs:(NSString *)content;
-(NSString *)inverse:(NSString *)content;
-(NSString *)square:(NSString *)content;
-(NSString *)sin:(NSString *)content;
-(NSString *)cos:(NSString *)content;
-(NSString *)tan:(NSString *)content;
-(NSString *)cube:(NSString *)content;
-(NSString *)asin:(NSString *)content;
-(NSString *)acos:(NSString *)content;
-(NSString *)atan:(NSString *)content;
-(NSString *)log:(NSString *)content;
-(NSString *)sinh:(NSString *)content;
-(NSString *)cosh:(NSString *)content;
-(NSString *)tanh:(NSString *)content;
-(NSString *)log2:(NSString *)content;
@end
