//
//  TableViewController.m
//  StudentScore
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import "TableViewController.h"
#import "Student.h"
#include "ViewController.h"

@interface TableViewController ()
@property(strong,nonatomic) NSMutableArray *students;//可变数组，存放所有学生对象
@property(strong,nonatomic) Student *student;//当前选中的学生对象
@property(strong,nonatomic) NSString *path;//用来保存目录
@end

@implementation TableViewController

- (IBAction)refreshData:(UIRefreshControl *)sender {
    [self.refreshControl beginRefreshing];
    [self.tableView reloadData];
    [self.refreshControl endRefreshing];
}

//保存到磁盘
-(void)writeToFile:(NSMutableArray*)sts filePath:(NSString *)path
{
    NSData *data;
    NSMutableArray *ds=[[NSMutableArray alloc]init];
    for (Student *s in sts) {
        data=[NSKeyedArchiver archivedDataWithRootObject:s];
        [ds addObject:data];
    }
    [ds writeToFile:path atomically:YES];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    NSString *doc=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    self.path=[doc stringByAppendingPathComponent:@"student.plist"];
    NSMutableArray *dataarray=[NSMutableArray arrayWithContentsOfFile:self.path];
    self.students=[[NSMutableArray alloc] init];
    for(NSData *s in dataarray)//遍历取出来的序列化数据
    {
        [self.students addObject:[NSKeyedUnarchiver unarchiveObjectWithData:s]];
    }
}

//场景过渡
-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    //添加信息的场景
    if([segue.identifier isEqualToString:@"addinfo"])
    {
        if ([segue.destinationViewController isKindOfClass:[ViewController class]]) {
            ViewController *vc=(ViewController*)segue.destinationViewController;
            vc.students=self.students;
            vc.indexPath=nil;
            vc.path=self.path;
        }
    }
    
    //查看详细信息的场景
    if([segue.identifier isEqualToString:@"showdetail"])
    {
        if ([segue.destinationViewController isKindOfClass:[ViewController class]]) {
            NSIndexPath *indexPath=[self.tableView indexPathForCell:sender];
            ViewController *vc=(ViewController*)segue.destinationViewController;
            vc.students=self.students;
            vc.indexPath=indexPath;
            vc.path=self.path;
        }
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

//生成表单元,datasource中数据取出来放到表视图上
-(UITableViewCell*) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell=[tableView dequeueReusableCellWithIdentifier:@"studentCell" forIndexPath:indexPath];
    self.student=self.students[indexPath.row];
    cell.textLabel.text=self.student.name;
    cell.detailTextLabel.text=self.student.number;
    return cell;
}

//删除表视图中的某个表单元
-(void)tableView:(UITableView *)tableView
commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if(editingStyle==UITableViewCellEditingStyleDelete){
        [self.students removeObjectAtIndex:indexPath.row];
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
        [self writeToFile:self.students filePath:self.path];
    }
}

//当点击表单元上附件图标时触发
-(void)tableView:(UITableView *)tableView
accessoryButtonTappedForRowWithIndexPath:( NSIndexPath *)indexPath
{
    ViewController *vc=[self.storyboard instantiateViewControllerWithIdentifier:@"modifyview"];
    vc.students=self.students;
    vc.indexPath=indexPath;
    vc.path=self.path;
    [self.navigationController pushViewController:vc animated:YES];
}

-(void)viewDidAppear:(BOOL)animate {
    [self.tableView reloadData];
}

#pragma mark - Table view data source
//表视图中小节的个数
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}
//表视图中小节中表单元的个数
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.students count];
}


@end
