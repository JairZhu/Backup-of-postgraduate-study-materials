//
//  ViewController.h
//  CoreDemo
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Teacher.h"

@interface ViewController : UIViewController
@property(strong,nonatomic)NSMutableArray *students;
@property(strong,nonatomic)Teacher *teacher;
@property(strong,nonatomic)NSIndexPath *indexPath;
@property(strong,nonatomic)NSManagedObjectContext *context;

@end

