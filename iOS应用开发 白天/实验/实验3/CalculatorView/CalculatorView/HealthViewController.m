//
//  HealthViewController.m
//  CalculatorView
//
//  Created by Jairzhu on 20-12-29.
//  Copyright (c) 2020年 Jairzhu. All rights reserved.
//

#import "HealthViewController.h"
#import "Calculator+Health.h"

@interface HealthViewController ()
@property (weak, nonatomic) IBOutlet UITextField *txtHeight;
@property (weak, nonatomic) IBOutlet UITextField *txtWeight;
@property (weak, nonatomic) IBOutlet UILabel *labelAdvice;
@property (weak, nonatomic) IBOutlet UILabel *labelBMI;
@property (weak, nonatomic) IBOutlet UIButton *btnCalculate;

@property (strong, nonatomic) Calculator *cal;

@end

@implementation HealthViewController
- (IBAction)computeBMI:(UIButton *)sender {
    NSString *score = [self.cal computeHealthWithHeight:self.txtHeight.text andWeight:self.txtWeight.text];
    if([score floatValue]<19)
        self.labelAdvice.text=@"你是魔鬼吗，多吃点吧";
    else if([score floatValue]<25)
        self.labelAdvice.text=@"你的身材不错";
    else if([score floatValue]<30)
        self.labelAdvice.text=@"你有点略胖";
    else if([score floatValue]<39)
        self.labelAdvice.text=@"你太胖了，少吃点吧";
    else
        self.labelAdvice.text=@"相扑选手，该减肥了";
    self.labelBMI.text = score;
    [self.labelAdvice.layer setMasksToBounds:YES];
    [self.labelAdvice.layer setBorderWidth:1];
    [self.labelBMI.layer setMasksToBounds:YES];
    [self.labelBMI.layer setBorderWidth:1];
}

-(void) viewWillAppear:(BOOL)animated {
    [self.btnCalculate.layer setMasksToBounds:YES];
    [self.btnCalculate.layer setCornerRadius:12];
    [self.btnCalculate.layer setBorderWidth:1];
}

-(BOOL)textFieldShouldReturn:(UITextField *)textField {
    if (textField == self.txtHeight || textField == self.txtWeight) {
        [textField resignFirstResponder];
    }
    return YES;
}

-(Calculator*) cal {
    if (_cal) {
        _cal = [[Calculator alloc] init];
    }
    return _cal;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.cal = [[Calculator alloc] init];
    // Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
