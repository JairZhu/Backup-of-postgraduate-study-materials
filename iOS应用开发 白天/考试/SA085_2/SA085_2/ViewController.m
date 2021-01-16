//
//  ViewController.m
//  SA085_2
//
//  Created by Jairzhu on 21-1-11.
//  Copyright (c) 2021年 SA20225085. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UIImageView *SA085_img1;
@property (weak, nonatomic) IBOutlet UIImageView *SA085_img2;
@property (weak, nonatomic) IBOutlet UITextField *SA085_label;

@property  BOOL SA085_flag1;
@property  BOOL SA085_flag2;

@property CGFloat SA085_x1;
@property CGFloat SA085_y1;
@property CGFloat SA085_x2;
@property CGFloat SA085_y2;
@end

@implementation ViewController

- (IBAction)SA085_pan1:(UIPanGestureRecognizer *)sender {
    if (sender.state == UIGestureRecognizerStateChanged || sender.state == UIGestureRecognizerStateEnded        ) {
        CGPoint dist = [sender translationInView:self.view];
        self.SA085_x1 = self.SA085_img1.center.x + dist.x;
        self.SA085_y1 =self.SA085_img1.center.y + dist.y;
        self.SA085_img1.center = CGPointMake(self.SA085_img1.center.x + dist.x, self.SA085_img1.center.y + dist.y);
        [sender setTranslation:CGPointZero inView:self.view];
    }
    if (sender.state == UIGestureRecognizerStateEnded) {
    CGFloat x = self.SA085_img1.center.x;
    CGFloat y = self.SA085_img1.center.y;
    if (x >= 153.5 && x <= 161.5 && y >= 414 && y <= 419) {
        self.SA085_flag1 = YES;
        if (self.SA085_flag2) {
            self.SA085_label.text = @"success";
            self.SA085_img1.center = CGPointMake(self.SA085_x1, self.SA085_y1);
        }
    }
    else {
        //self.SA085_label.text = @"failed";
    }
    }
}
- (IBAction)SA085_pan2:(UIPanGestureRecognizer *)sender {
    if (sender.state == UIGestureRecognizerStateChanged || sender.state == UIGestureRecognizerStateEnded        ) {
        CGPoint dist = [sender translationInView:self.view];
        self.SA085_x2 =self.SA085_img2.center.x + dist.x;
        self.SA085_y2 = self.SA085_img2.center.y + dist.y;
        self.SA085_img2.center = CGPointMake(self.SA085_img2.center.x + dist.x, self.SA085_img2.center.y + dist.y);
        [sender setTranslation:CGPointZero inView:self.view];
    }
    if (sender.state == UIGestureRecognizerStateEnded) {
        CGFloat x = self.SA085_img2.center.x;
        CGFloat y = self.SA085_img2.center.y;
        if (x >= 153.5 && x <= 161.5 && y >= 565 && y <= 568.5) {
            self.SA085_flag2 = YES;
            if (self.SA085_flag1) {
                self.SA085_label.text = @"success";
                self.SA085_img2.center = CGPointMake(self.SA085_x2, self.SA085_y2);
            }
        }
        else {
            //self.SA085_label.text = @"failed";
        }
    }
}


- (void) SA085_getImage: (NSString*) path ImageView: (UIImageView*) imageView isSleeped:(BOOL) tag {
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_async(queue, ^{
        NSURL *urlstr = [NSURL URLWithString:path];
        NSData *data = [NSData dataWithContentsOfURL:urlstr];
        UIImage *image = [UIImage imageWithData:data];
        if (tag) {
            [NSThread sleepForTimeInterval:3.0];
        }
        dispatch_async(dispatch_get_main_queue(), ^{imageView.image = image;});
    });
}

- (void)viewDidLoad {
    self.SA085_flag1 = NO;
    self.SA085_flag2 = NO;
    [super viewDidLoad];
    [self SA085_getImage:@"https://sse.ustc.edu.cn/_upload/article/images/9f/f8/ef82f7de4ebe86b312d363632d27/1ec48ce5-d415-4eca-ba12-fd56f1d36968.jpg" ImageView:self.SA085_img1 isSleeped:NO];
    [self SA085_getImage:@"https://sse.ustc.edu.cn/_upload/article/images/9f/f8/ef82f7de4ebe86b312d363632d27/2ec3ec55-7d89-4c18-819d-8cdf5252a64b.jpg" ImageView:self.SA085_img2 isSleeped:NO];
    [self.SA085_img1 setUserInteractionEnabled:YES];
    [self.SA085_img2 setUserInteractionEnabled:YES];
    [self.SA085_img1 setMultipleTouchEnabled:YES];
    [self.SA085_img2 setMultipleTouchEnabled:YES];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
