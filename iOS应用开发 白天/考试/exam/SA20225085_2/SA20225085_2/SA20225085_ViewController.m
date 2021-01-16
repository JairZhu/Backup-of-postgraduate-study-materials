//
//  SA20225085ViewController.m
//  SA20225085_2
//
//  Created by Jairzhu on 21-1-11.
//  Copyright (c) 2021年 SA20225085. All rights reserved.
//

#import "SA20225085_ViewController.h"

@interface SA20225085_ViewController ()
@property (weak, nonatomic) IBOutlet UILabel *SA20225085_label;

@end

@implementation SA20225085_ViewController

- (IBAction)SA20225085_upper:(UIButton *)sender {
    if (self.SA20225085_string.length == 0) return;
    NSString *SA20225085_copy = [NSString stringWithFormat:@"%@", self.SA20225085_string];
    [self.SA20225085_string setString:@""];
    for (int i = 0; i < SA20225085_copy.length; i++) {
        NSString *SA20225085_str = [SA20225085_copy substringWithRange:NSMakeRange(i, 1)];
        if ((i == 0 && [SA20225085_copy characterAtIndex:i] != ' ') || ([SA20225085_copy characterAtIndex:i] != ' ' && [SA20225085_copy characterAtIndex:i - 1] == ' ')) {
            SA20225085_str = [SA20225085_str uppercaseString];
        }
        [self.SA20225085_string appendString:SA20225085_str];
    }
}

- (IBAction)SA2022085_lower:(UIButton *)sender {
    if (self.SA20225085_string.length == 0) return;
    NSString *SA20225085_copy = [NSString stringWithFormat:@"%@", self.SA20225085_string];
    [self.SA20225085_string setString:@""];
    for (int i = 0; i < SA20225085_copy.length; i++) {
        NSString *SA20225085_str = [SA20225085_copy substringWithRange:NSMakeRange(i, 1)];
        if ((i == 0 && [SA20225085_copy characterAtIndex:i] != ' ') || ([SA20225085_copy characterAtIndex:i] != ' ' && [SA20225085_copy characterAtIndex:i - 1] == ' ')) {
            SA20225085_str = [SA20225085_str lowercaseString];
        }
        [self.SA20225085_string appendString:SA20225085_str];
    }
}



- (void) viewWillAppear:(BOOL)animated  {
    [self.SA20225085_string appendString:@" "];
    NSInteger num = 0, i = 0, j = 0;
    while (i < self.SA20225085_string.length) {
        if ([self.SA20225085_string characterAtIndex:i] == ' ') {
            if (i != j) {
                num++;
            }
            j = ++i;
        }
        else {
            ++i;
        }
    }
    self.SA20225085_label.text = [NSString stringWithFormat:@"%lu", (unsigned long)num];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
