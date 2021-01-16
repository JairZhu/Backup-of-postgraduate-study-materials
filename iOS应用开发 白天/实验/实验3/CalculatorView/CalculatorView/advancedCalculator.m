//
//  advancedCalculator.m
//  CalculatorView
//
//  Created by Jairzhu on 20-12-29.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "advancedCalculator.h"

@implementation advancedCalculator
-(NSString *) sqrt:(NSString *)content {
    double d = [content doubleValue];
    double result = sqrt(d);
    NSNumber *n = [[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}

-(NSString*) abs:(NSString *)content {
    double d = [content doubleValue];
    double result = fabs(d);
    NSNumber *n = [[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}

-(NSString *)inverse:(NSString *)content {
    double d=[content doubleValue];
    double result=1/d;
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}

-(NSString *)square:(NSString *)content {
    double d=[content doubleValue];
    double result=d*d;
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}

-(NSString *)sin:(NSString *)content {
    double d=[content doubleValue];
    double result=sin(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)cos:(NSString *)content {
    double d=[content doubleValue];
    double result=cos(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)tan:(NSString *)content {
    double d=[content doubleValue];
    double result=tan(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)cube:(NSString *)content {
    double d=[content doubleValue];
    double result=d*d*d;
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)asin:(NSString *)content {
    double d=[content doubleValue];
    double result=asin(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)acos:(NSString *)content {
    double d=[content doubleValue];
    double result=acos(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)atan:(NSString *)content {
    double d=[content doubleValue];
    double result=atan(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)log:(NSString *)content {
    double d=[content doubleValue];
    double result=log(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)sinh:(NSString *)content {
    double d=[content doubleValue];
    double result=sinh(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)cosh:(NSString *)content {
    double d=[content doubleValue];
    double result=cosh(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)tanh:(NSString *)content {
    double d=[content doubleValue];
    double result=tanh(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}
-(NSString *)log2:(NSString *)content {
    double d=[content doubleValue];
    double result=log2(d);
    NSNumber *n=[[NSNumber alloc] initWithDouble:result];
    return [n stringValue];
}

@end
