//
//  ViewController.m
//  SA20225085_1
//
//  Created by Jairzhu on 21-1-11.
//  Copyright (c) 2021年 SA20225085. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *SA20225085_textview;

@end

@implementation ViewController
- (IBAction)SA20225085_changeRedColor:(UIButton *)SA20225085_sender {
    self.SA20225085_textview.backgroundColor = [UIColor redColor];
}

- (IBAction)SA20225085_changeYellowColor:(UIButton *)SA20225085_sender {
    self.SA20225085_textview.backgroundColor = [UIColor yellowColor];
}


- (BOOL) textFieldShouldReturn:(UITextField *) SA20225085_textField {
    if (SA20225085_textField == self.SA20225085_textview) {
        [SA20225085_textField resignFirstResponder];
    }
    return YES;
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
