//
//  main.m
//  CalculatorCMD
//
//  Created by Jairzhu on 20-12-14.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "Calculator.h"

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // insert code here...
        char input[100];
        scanf("%s", input);
        NSString *express = [NSString stringWithCString:input encoding:NSUTF8StringEncoding];
        Calculator * calculate = [[Calculator alloc] init];
        NSString *result = [calculate ExpressionCalculate:express];
        NSLog(@"result: %@", result);
    }
    return 0;
}
