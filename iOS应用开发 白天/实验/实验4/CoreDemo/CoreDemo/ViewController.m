//
//  ViewController.m
//  CoreDemo
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import "ViewController.h"
#import "Student.h"
#import "TableViewController.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *TxtName;
@property (weak, nonatomic) IBOutlet UITextField *TxtNumber;
@property (weak, nonatomic) IBOutlet UITextField *TxtAge;
@property (weak, nonatomic) IBOutlet UITextField *TxtScore;
@property (weak, nonatomic) IBOutlet UITextView *TxtMemo;
@property (weak, nonatomic) IBOutlet UITextField *TxtTeacher;

@end

@implementation ViewController

- (BOOL) isNumber: (NSString*) str {
    NSInteger i = 0;
    if (str.length == 0) return NO;
    while (i < str.length) {
        if ([str characterAtIndex:i] < '0' || [str characterAtIndex:i] > '9') {
            return NO;
        }
        i++;
    }
    return YES;
}

- (IBAction)datasave:(id)sender {
    Student *stu;
    if(self.indexPath==nil)
    {
        stu=[NSEntityDescription insertNewObjectForEntityForName:@"Student" inManagedObjectContext:self.context];
        [self.students addObject:stu];
    }
    else
        stu = self.students[self.indexPath.row];
    if (![self isNumber:self.TxtAge.text] || ![self isNumber:self.TxtScore.text]) {
        // 初始化对话框
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"提示" message:@"请输入数字" preferredStyle:UIAlertControllerStyleAlert];
        [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil]];
        // 弹出对话框
        [self presentViewController:alert animated:true completion:nil];
        NSLog(@"alert");
    }
    else {
    stu.name=self.TxtName.text;
    stu.number=self.TxtNumber.text;
    stu.age = [NSNumber numberWithFloat:[self.TxtAge.text floatValue]];
    stu.score = [NSNumber numberWithFloat:[self.TxtScore.text floatValue] ];
    stu.memo=self.TxtMemo.text;
    stu.whoTeach=self.teacher;
    NSError *errorstudent;
    if(![self.context save:&errorstudent])
    {
        NSLog(@"保存时出错");
    }
    [self.navigationController popToRootViewControllerAnimated:YES];
    }
}
- (IBAction)dataclear:(id)sender {
    self.TxtName.text=nil;
    self.TxtNumber.text=nil;
    self.TxtAge.text=nil;
    self.TxtScore.text=nil;
    self.TxtMemo.text=nil;
    self.TxtTeacher.text=nil;
}

-(void)viewWillAppear:(BOOL)animated
{
    if(self.indexPath!=nil)
    {
        Student *student=self.students[self.indexPath.row];
        self.TxtName.text=student.name;
        self.TxtNumber.text=student.number;
        self.TxtAge.text=[NSString stringWithFormat:@"%@", [student.age stringValue]];
        self.TxtScore.text=[NSString stringWithFormat:@"%@",[student.score stringValue]];
        self.TxtMemo.text=student.memo;
        self.TxtTeacher.text=student.whoTeach.name;
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
