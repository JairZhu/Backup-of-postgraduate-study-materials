//
//  ViewController.m
//  SA085_1
//
//  Created by Jairzhu on 21-1-11.
//  Copyright (c) 2021年 SA20225085. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *SA085_testfield;

@end

@implementation ViewController

- (BOOL) textFieldShouldReturn:(UITextField *)textField {
    if (textField == self.SA085_testfield) {
        [textField resignFirstResponder];
    }
    return YES;
}

- (IBAction)SA085_changeRed:(id)sender {
    self.SA085_testfield.backgroundColor = [UIColor redColor];
}
- (IBAction)SA085_changeYellow:(id)sender {
    self.SA085_testfield.backgroundColor = [UIColor yellowColor];
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
