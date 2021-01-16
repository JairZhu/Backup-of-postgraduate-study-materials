//
//  ViewController.m
//  SA20225085_3
//
//  Created by Jairzhu on 21-1-11.
//  Copyright (c) 2021年 SA20225085. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *SA20225085_lefttextfield;
@property (weak, nonatomic) IBOutlet UITextField *SA20225085_righttextfield;
@property (weak, nonatomic) IBOutlet UILabel *SA20225085_label;
@property (weak, nonatomic) IBOutlet UIButton *SA20225085_button;

@end

@implementation ViewController

- (BOOL) textFieldShouldReturn:(UITextField *)textField {
    if (textField == self.SA20225085_lefttextfield || textField == self.SA20225085_righttextfield) {
        [textField resignFirstResponder];
    }
    return YES;
}

- (void) viewWillAppear:(BOOL)animated {
    [self.SA20225085_button.layer setMasksToBounds:YES];
    [self.SA20225085_button.layer setCornerRadius:12];
    [self.SA20225085_button.layer setBorderWidth:1];
}

- (BOOL) SA20225085_isNumber: (NSString*) str {
    NSLog(@"%@", str);
    NSInteger i = 0, count = 0;
    if (str.length == 0) return NO;
    while (i < str.length) {
        if ([str characterAtIndex:i] == '.') count++;
        else if ([str characterAtIndex:i] < '0' || [str characterAtIndex:i] > '9') {
            return NO;
        }
        i++;
    }
    if (count > 1) return NO;
    return YES;
}

- (IBAction)SA20225085_calculate:(UIButton *)sender {
    if (![self SA20225085_isNumber:self.SA20225085_lefttextfield.text] || ![self SA20225085_isNumber:self.SA20225085_righttextfield.text]) {
        // 初始化对话框
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示" message:@"请输入数字" preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil]];
        // 弹出对话框
        [self presentViewController:alert animated:true completion:nil];
        NSLog(@"alert");
        self.SA20225085_lefttextfield.text = @"";
        self.SA20225085_righttextfield.text = @"";
    }
    else {
        float left = [self.SA20225085_lefttextfield.text floatValue];
        float right = [self.SA20225085_righttextfield.text floatValue];
        self.SA20225085_label.text = [NSString stringWithFormat:@"%0.2f", left + right];
        NSLog(@"calculate");
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
