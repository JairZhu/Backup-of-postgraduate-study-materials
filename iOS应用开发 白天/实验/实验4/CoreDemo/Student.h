//
//  Student.h
//  CoreDemo
//
//  Created by Jairzhu on 21-1-7.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

@class Teacher;

@interface Student : NSManagedObject

@property (nonatomic, retain) NSNumber * age;
@property (nonatomic, retain) NSString * memo;
@property (nonatomic, retain) NSString * name;
@property (nonatomic, retain) NSString * number;
@property (nonatomic, retain) NSNumber * score;
@property (nonatomic, retain) Teacher *whoTeach;

@end
