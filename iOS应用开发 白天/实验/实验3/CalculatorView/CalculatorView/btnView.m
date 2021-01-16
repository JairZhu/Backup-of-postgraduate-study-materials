//
//  btnView.m
//  CalculatorView
//
//  Created by Jairzhu on 20-12-23.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "btnView.h"

@implementation btnView

-(void) awakeFromNib {
    [self.layer setMasksToBounds:YES];
    [self.layer setCornerRadius:12];
    [self.layer setBorderWidth:1];
}

@end
