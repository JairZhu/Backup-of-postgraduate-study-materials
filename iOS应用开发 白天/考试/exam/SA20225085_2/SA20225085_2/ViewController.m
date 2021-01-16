//
//  ViewController.m
//  SA20225085_2
//
//  Created by Jairzhu on 21-1-11.
//  Copyright (c) 2021年 SA20225085. All rights reserved.
//

#import "ViewController.h"
#import "SA20225085_ViewController.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *SA20225085_textfield;
@end

@implementation ViewController

- (BOOL) textFieldShouldReturn:(UITextField *)textField {
    if (textField == self.SA20225085_textfield) {
        [textField resignFirstResponder];
    }
    return YES;
}

- (void) viewWillAppear:(BOOL)animated {
    self.SA20225085_textfield.text = self.SA20225085_string;
}

- (NSMutableString*) SA20225085_string {
    if (!_SA20225085_string) {
        _SA20225085_string = [[NSMutableString alloc] init];
    }
    return _SA20225085_string;
}

- (void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"SA20225085_view"]) {
        if ([segue.destinationViewController isKindOfClass:[SA20225085_ViewController class]]) {
            SA20225085_ViewController* SA20225085_viewcontroller = (SA20225085_ViewController *) segue.destinationViewController;
            [self.SA20225085_string setString:@""];
            [self.SA20225085_string appendString:self.SA20225085_textfield.text];
            SA20225085_viewcontroller.SA20225085_string = self.SA20225085_string;
            NSLog(@"%@", SA20225085_viewcontroller.SA20225085_string);
        }
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
