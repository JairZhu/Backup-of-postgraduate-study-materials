//
//  ViewController.h
//  StudentScore
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController
@property(strong,nonatomic) NSMutableArray *students;//类比表视图
@property(strong,nonatomic) NSIndexPath *indexPath;//选择哪个表单元路径信息
@property(strong,nonatomic) NSString *path;//类比表视图

@end

