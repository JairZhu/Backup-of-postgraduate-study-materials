//
//  Calculator.m
//  CalculatorCMD
//
//  Created by Jairzhu on 20-12-14.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "Calculator.h"
#import "Stack.h"

@interface Calculator()
//类扩展，私有参数和方法
//分离运算符和数值
@property (nonatomic, strong) NSMutableArray *operArray;
@property (nonatomic, strong)NSMutableArray *valueArray;

//初始化两个栈：操作数栈和运算符栈
@property(nonatomic,strong) Stack *valueStack;
@property (nonatomic) NSUInteger vsSize;
@property(nonatomic,strong) Stack *operStack;
@property (nonatomic) NSUInteger osSize;

@end

@implementation Calculator

//合法操作符
-(NSArray *)validOperator
{
    NSArray * opers = @[@"+", @"-", @"*", @"/", @"%", @"(", @")", @"="];
    return opers;
}

//入栈优先级
-(NSDictionary *)inStackPriority
{
    return @{@"(":@1, @"*":@5, @"/":@5, @"%":@5, @"+":@3, @"-":@3, @")":@8, @"=":@0 };
}

//出栈优先级
-(NSDictionary *)outStackPriority
{
    return @{@"(":@8, @"*":@4, @"/":@4, @"%":@4, @"+":@2, @"-":@2, @")":@1, @"=":@0 };
}

//判断当前字符是操作符还是数字
-(BOOL)isOperator:(NSString*) str{
    if ([[self validOperator] containsObject:str]) {
        return YES;
    }
    else
        return NO;
}

//判断表达式是否合法
-(BOOL)isLegical:(NSString*) str{
    NSUInteger len = [str length];
    //左右括号游标，用来判断左右括号是否匹配
    NSUInteger l = 0, r= 0;
    
    for(NSUInteger i = 0;i<len;i++){
        char ch = [str characterAtIndex:i];
        NSString* chstr = [NSString stringWithFormat:@"%c",ch];
        
        //是数字，略过
        if(![self isOperator:chstr]){
            continue;
        }
        //左括号
        else if([chstr isEqualToString:@"("]){
            l++;
        }
        //右括号
        else if([chstr isEqualToString:@")"]){
            r++;
        }
        //既不是数字也不是括号,判断下一个字符
        else{
            NSUInteger j = i+1;
            if(j<len){
                char nextch = [str characterAtIndex:j];
                NSString *jStr = [NSString stringWithFormat:@"%c",nextch];
                if([self isOperator:jStr]){
                    if(![jStr isEqualToString:@"("]&&![jStr isEqualToString:@")"]){
                        return NO;
                    }
                }
            }
        }
    }
    //左右括号不匹配
    if(l != r){
        return NO;
    }
    return YES;
}

//清楚空格
-(NSMutableArray *)clearWhitespace:(NSMutableArray *)inputArray
{
    NSMutableArray * tempArray = [NSMutableArray array];
    for (int i = 0; i < inputArray.count; i++) {
        if (![inputArray[i] isEqualToString:@""]) {
            [tempArray addObject:inputArray[i]];
        }
    }
    return tempArray;
}

//检查是不是数字（包含小数和负数）
-(BOOL)isNumberic:(NSString *)str
{
    NSCharacterSet* Digits = [NSCharacterSet decimalDigitCharacterSet];
    NSString *value = [str stringByTrimmingCharactersInSet:Digits];
    
    //检测字符串中除数字之外的字符
    if ([value length]!= 0) {
        //包含.或者-可能为小数或者负数
        if (!([value isEqualToString:@"."] ^ [value isEqualToString:@"-"])) {
            NSLog(@"不是数字");
            return NO;
        }
    }
    return YES;
}

//比较运算符优先级大小
-(NSString *)comparePriority:(NSString *)inOptr outOptr:(NSString *)outOptr
{
    NSDictionary *inStackPriority = [self inStackPriority];
    NSDictionary *outStackPriority = [self outStackPriority];
    
    NSString *inPriority = inStackPriority[inOptr];
    NSString *outPriority = outStackPriority[outOptr];
    
    NSInteger isp = [inPriority integerValue];
    NSInteger icp = [outPriority integerValue];
    
    if (isp > icp)
        return @">";
    else if (isp < icp)
        return @"<";
    else
        return @"=";
}

//纯计算(两个操作数根据制定运算符进行运算）
-(double)calculate:(double)opnd1 opnd2:(double)opnd2 optr:(NSString *)optr
{
    NSArray *items = @[@"+", @"-", @"*", @"/"];
    int item = (int)[items indexOfObject:optr];
    
    switch (item) {
        case 0:
            return (opnd1 + opnd2);
            break;
        case 1:
            return (opnd1 - opnd2);
            break;
        case 2:
            return (opnd1 * opnd2);
            break;
        case 3:
            if (opnd2 == 0) {
                NSLog(@"除法，除数为0");
                return -180808;
                break;
            }
            return (opnd1 / opnd2);
            break;
        default:
            return 0;
            break;
    }
}



//计算
-(NSString *)ExpressionCalculate:(NSString *)inputString{
    inputString = [inputString stringByAppendingString:@"="];
    //先判断表达式是否合法
    if(![self isLegical:inputString]){
        //NSLog(@"字符串不是数学表达式无法计算");
        return @"字符串不是数学表达式无法计算";
    }
    
    //从输入的字符串中提取运算符和数值
    //初始化两个数组
    self.operArray = [NSMutableArray array];
    self.valueArray = [NSMutableArray array];
    
    for (NSUInteger i = 0;i<inputString.length;i++){
        char ch = [inputString characterAtIndex:i];
        NSString *temp = [NSString stringWithFormat:@"%c",ch];
        if([self isOperator:temp]&&![temp isEqualToString: @"="]){
            [self.operArray addObject:temp];
        }
    }
    NSArray *tempArray = [inputString componentsSeparatedByCharactersInSet: [NSCharacterSet characterSetWithCharactersInString:@"(+-*/%=)"]];
    self.valueArray = [NSMutableArray arrayWithArray:tempArray];
    
    //清楚空格
    self.valueArray = [self clearWhitespace:self.valueArray];
    //检查数值数组中是否含有非数字字符
    for (NSString *ch in self.valueArray) {
        if (![self isNumberic:ch]) {
            //NSLog(@"含有非法字符");
            return @"含有非法字符";
        }
    }
    
    //初始化两个栈
    self.osSize = self.operArray.count;
    self.operStack = [[Stack alloc]initWithSize:self.osSize];
    self.vsSize = self.valueArray.count;
    self.valueStack = [[Stack alloc]initWithSize:self.vsSize];
    
    //等号入栈
    [self.operStack push:@"="];
    
    //暂存括号
    NSString *bracket;
    //暂存运算符
    NSString *oper;
    //暂存操作数
    NSString *value1, *value2;
    
    for(NSUInteger i = 0;i<[inputString length];i++){
        char ch = [inputString characterAtIndex:i];
        NSString *str = [NSString stringWithFormat:@"%c", ch];
        
        
        if (([str isEqualToString:@"="]) && ([[self.operStack getTop] isEqualToString:@"="]) ) {
            break;
        }
        
        else if([self isOperator:str]){
            
            NSString *pr = [self comparePriority:[self.operStack getTop] outOptr:str];
            NSArray *items = @[@"<", @"=", @">"];
            int item = (int)[items indexOfObject:pr];
            
            switch (item) {
                case 0:
                    
                    [self.operStack push:str];
                    break;
                case 1:
                    
                    bracket = [self.operStack pop];
                    break;
                case 2:
                {
                    
                    i--;
                    oper = [self.operStack pop];
                    value2 = [self.valueStack pop];
                    value1 = [self.valueStack pop];
                    
                    double a = [value1 doubleValue];
                    double b = [value2 doubleValue];
                    
//                    double c = [self calculate:a opnd2:b optr:oper];
                    double c;
                    NSArray *items = @[@"+", @"-", @"*", @"/"];
                    int item = (int)[items indexOfObject:oper];
                    
                    switch (item) {
                        case 0:
                            c = a + b;
                            break;
                        case 1:
                            c = a - b;
                            break;
                        case 2:
                            c = a * b;
                            break;
                        case 3:
                            if (b == 0) {
                                NSLog(@"除法，除数为0");
                                return @"错误，除数不能为0";
                                break;
                            }
                            c= a / b;
                            break;
                        default:
                            return 0;
                            break;
                    }
                    NSNumber *num = [[NSNumber alloc] initWithDouble:c];
                    NSString *result = [num stringValue];
                    [self.valueStack push:result];
                    break;
                }
                default:
                    break;
            }
        }
        
        else{
            
            NSUInteger j = i+1;
            if (j<[inputString length]) {
                char nextch = [inputString characterAtIndex:j];
                NSString *nextstr = [NSString stringWithFormat:@"%c", nextch];
                
                if(![self isOperator:nextstr])
                    continue;
                else{
                    [self.valueStack push:[self.valueArray firstObject]];
                    [self.valueArray removeObjectAtIndex:0];
                }
            }
            else{
                [self.valueStack push:[self.valueArray firstObject]];
                [self.valueArray removeObjectAtIndex:0];
            }
        }
    }
    
    NSString *expResult = [self.valueStack getTop];
    return expResult;
}
@end
