//
//  ViewController.m
//  CalculatorView
//
//  Created by Jairzhu on 20-12-22.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "ViewController.h"
#import "advancedCalculator.h"
#import "SecondViewController.h"
@interface ViewController ()
@property (weak, nonatomic) IBOutlet UILabel *txtdisplay;
@property (weak, nonatomic) IBOutlet UIButton *btn1;
@property (weak, nonatomic) IBOutlet UIButton *btn2;
@property (weak, nonatomic) IBOutlet UIButton *btn3;
@property (weak, nonatomic) IBOutlet UIButton *btn4;
@property (weak, nonatomic) IBOutlet UIButton *btn5;
@property (weak, nonatomic) IBOutlet UIButton *btn6;
@property (weak, nonatomic) IBOutlet UIButton *btn7;
@property (weak, nonatomic) IBOutlet UIButton *btn8;
@property (weak, nonatomic) IBOutlet UIButton *btn9;
@property (weak, nonatomic) IBOutlet UIButton *btndot;
@property (weak, nonatomic) IBOutlet UIButton *btn0;
@property (weak, nonatomic) IBOutlet UIButton *btndiv;
@property (weak, nonatomic) IBOutlet UIButton *btnsub;
@property (weak, nonatomic) IBOutlet UIButton *btnmult;
@property (weak, nonatomic) IBOutlet UIButton *btnadd;

@property (strong, nonatomic) advancedCalculator* cal;

@end

@implementation ViewController
- (IBAction)inputNumber:(UIButton *)sender {
    NSMutableString *str = [NSMutableString stringWithString:self.txtdisplay.text];
    if ([[[sender titleLabel] text] isEqualToString:@"×"]) {
        [self.cal.str appendString:@"*"];
    }
    else if ([[[sender titleLabel] text] isEqualToString:@"÷"]) {
        [self.cal.str appendString:@"/"];
    } else {
        [self.cal.str appendString: [[sender titleLabel] text]];
    }
    [str appendString:[[sender titleLabel] text]];
    if (str.length > 17) {
        self.txtdisplay.text = [str substringWithRange:NSMakeRange(str.length - 17, 17)];
    }
    else {
        self.txtdisplay.text = str;
    }
}

- (IBAction)clear:(UIButton *)sender {
    self.txtdisplay.text = @"";
    [self.cal cleardisp];
}
- (IBAction)delNumber:(UIButton *)sender {
    long len = self.cal.str.length - 1;
    if (len >= 0) {
        [self.cal.str deleteCharactersInRange:NSMakeRange(len, 1)];
        if (self.cal.str.length > 17) {
            self.txtdisplay.text = [self.cal.str substringWithRange:NSMakeRange(self.cal.str.length - 17, 17)];
        }
        else {
            self.txtdisplay.text = self.cal.str;
        }
        NSLog(@"%@",self.cal.str);
    }
}

- (IBAction)compute:(UIButton *)sender {
    if (self.txtdisplay.text.length != 0) {
        self.txtdisplay.text = self.cal.computedResult;
        self.cal.str = [NSMutableString stringWithString:self.txtdisplay.text];
    }
}


-(advancedCalculator*) cal {
    if (!_cal) {
        _cal = [[advancedCalculator alloc] init];
    }
    return _cal;
}

-(void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"SecondScene"]) {
        if ([segue.destinationViewController isKindOfClass:[SecondViewController class]]) {
            SecondViewController *svc = (SecondViewController *) segue.destinationViewController;
            svc.cal = self.cal;
        }
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

- (void)viewDidLoad {
    [super viewDidLoad];
    self.cal = [[advancedCalculator alloc]init];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
