//
//  SecondViewController.m
//  CalculatorView
//
//  Created by Jairzhu on 20-12-29.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "SecondViewController.h"

@interface SecondViewController ()
@property (weak, nonatomic) IBOutlet UILabel *txtdisplay;
@property (weak, nonatomic) IBOutlet UIButton *btnleft;
@property (weak, nonatomic) IBOutlet UIButton *btnright;
@property (weak, nonatomic) IBOutlet UIButton *btne;
@property (weak, nonatomic) IBOutlet UIButton *btnpi;

@end

@implementation SecondViewController

- (IBAction)inputKey:(UIButton *)sender {
    if (sender.tag == 0 || sender.tag == 1 || sender.tag == 2 || sender.tag == 3) {
        NSMutableString *str = [NSMutableString stringWithString:self.txtdisplay.text];
        if ([[[sender titleLabel] text] isEqualToString:@"e"]) {
            [self.cal.str  appendString:@"2.7182818"];
        }
        else if ([[[sender titleLabel] text] isEqualToString:@"pi"]) {
            [self.cal.str appendString:@"3.1415926"];
        }
        else {
            [self.cal.str appendString:[[sender titleLabel] text]];
        }
        [str appendString:[[sender titleLabel] text]];
        if (str.length > 17) {
            self.txtdisplay.text = [str substringWithRange:NSMakeRange(str.length - 17, 17)];
        }
        else {
            self.txtdisplay.text = str;
        }
    }
    if (sender.tag == 5) {
        self.cal.str = [NSMutableString stringWithString: [self.cal sqrt:[self.cal computedResult]]];
        self.txtdisplay.text = self.cal.str;
    }
    if (sender.tag==4)//绝对值abs
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal abs:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str ;
    }
    if (sender.tag==6)//倒数1/x
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal inverse:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==7)//平方x^2
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal square:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==8)//sin
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal sin:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==9)//cos
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal cos:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==10)//tan
    {
        self.cal.str =[NSMutableString stringWithString:[self.cal tan:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==11)//cube
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal cube:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==12)//asin
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal asin:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==13)//acos
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal acos:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==14)//atan
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal atan:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==15)//ln
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal log:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==16)//sinh
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal sinh:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==17)//cosh
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal cosh:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==18)//tanh
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal tanh:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
    if (sender.tag==19)//log2
    {
        self.cal.str=[NSMutableString stringWithString:[self.cal log2:[self.cal computedResult]]];
        self.txtdisplay.text=self.cal.str;
    }
}

-(void) viewWillAppear:(BOOL)animated {
    if (self.cal.str.length > 17) {
        self.txtdisplay.text = [self.cal.str substringWithRange:NSMakeRange(self.cal.str.length - 17, 17)];
    }
    else {
        self.txtdisplay.text = self.cal.str;
    }
}


-(void) viewDidLoad {
    [super viewDidLoad];
}

-(void) didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

@end
