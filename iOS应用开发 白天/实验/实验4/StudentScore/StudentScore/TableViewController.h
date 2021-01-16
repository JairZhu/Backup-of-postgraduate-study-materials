//
//  TableViewController.h
//  StudentScore
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface TableViewController : UITableViewController
-(void)writeToFile:(NSMutableArray*)sts filePath:(NSString *)path;
@end
