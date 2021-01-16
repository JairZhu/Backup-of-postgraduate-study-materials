//
//  ViewController.m
//  StudentScore
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import "ViewController.h"
#import "Student.h"
#import "TableViewController.h"

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UITextField *TxtName;
@property (weak, nonatomic) IBOutlet UITextField *TxtAge;
@property (weak, nonatomic) IBOutlet UITextField *TxtScore;
@property (weak, nonatomic) IBOutlet UITextView *TxtMemo;
@property (weak, nonatomic) IBOutlet UITextField *TxtNumber;

@end

@implementation ViewController

- (IBAction)DataSave:(UIButton *)sender {
    //归档，列表
    TableViewController *tc=[[TableViewController alloc] init];
    Student *student=[[Student alloc] init];
    student.name=self.TxtName.text;
    student.number=self.TxtNumber.text;
    student.age=[self.TxtAge.text floatValue];
    student.score=[self.TxtScore.text floatValue];
    student.memo=self.TxtMemo.text;
    student.teacher=@"Tian Bai";
    //把数组保存到属性列表中
    if(self.indexPath==nil)
    {
        [self.students addObject:student];
        [tc writeToFile:self.students filePath:self.path];
    }else
    {
        self.students[self.indexPath.row]=student;
        [tc writeToFile:self.students filePath:self.path];
    }
    [self.navigationController popToRootViewControllerAnimated:YES];
}

- (IBAction)DataClear:(UIButton *)sender {
    self.TxtMemo.text=nil;
    self.TxtScore.text=nil;
    self.TxtAge.text=nil;
    self.TxtName.text=nil;
    self.TxtNumber.text=nil;
}

-(void)viewWillAppear:(BOOL)animated
{
    if(self.indexPath!=nil)
    {
        Student *student=self.students[self.indexPath.row];
        self.TxtName.text=student.name;
        self.TxtNumber.text=student.number;
        self.TxtAge.text=[NSString stringWithFormat:@"%ld",(long)student.age];
        self.TxtScore.text=[NSString stringWithFormat:@"%f",student.score];
        self.TxtMemo.text=student.memo;
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
