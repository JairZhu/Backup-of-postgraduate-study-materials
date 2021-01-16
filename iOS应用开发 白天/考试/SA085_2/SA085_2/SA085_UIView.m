//
//  SA085_UIView.m
//  SA085_2
//
//  Created by Jairzhu on 21-1-11.
//  Copyright (c) 2021年 SA20225085. All rights reserved.
//

#import "SA085_UIView.h"

@implementation SA085_UIView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.*/
- (void)drawRect:(CGRect)rect {
    CGContextStrokeRect(UIGraphicsGetCurrentContext(), CGRectMake(43, 350, 230, 135));
    CGContextStrokeRect(UIGraphicsGetCurrentContext(), CGRectMake(43, 500, 230, 135));
}


@end
