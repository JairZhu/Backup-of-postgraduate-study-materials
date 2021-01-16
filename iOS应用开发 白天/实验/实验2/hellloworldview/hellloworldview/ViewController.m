//
//  ViewController.m
//  hellloworldview
//
//  Created by Jairzhu on 20-12-22.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "ViewController.h"
#import "HelloWorld.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UIButton *btn1;
@property (weak, nonatomic) IBOutlet UIButton *btn2;
@property (weak, nonatomic) IBOutlet UIButton *btn3;
@property (weak, nonatomic) IBOutlet UITextField *text;
@property (weak, nonatomic) IBOutlet UILabel *label;

@end

@implementation ViewController
- (IBAction)sayhello:(UIButton *)sender {
    self.label.text = [HelloWorld sayHelloWorld];
}

- (IBAction)sayhello2:(UIButton *)sender {
    HelloWorld *h = [[HelloWorld alloc] init];
    self.label.text = [h sayHello:@"iOS world"];
}

- (IBAction)sayhello3:(UIButton *)sender {
    HelloWorld *h = [[HelloWorld alloc] init];
    h.something = self.text.text;
    self.label.text = [h saySomething];
}

- (BOOL) textFieldShouldReturn:(UITextField *)textField {
    if (textField == self.text)
        [textField resignFirstResponder];
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
