//
//  Student.h
//  StudentScore
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Student : NSObject<NSCopying>
@property(strong , nonatomic) NSString *name;
@property(strong , nonatomic) NSString *number;
@property(nonatomic) NSInteger age;
@property(nonatomic) float score;
@property(strong , nonatomic) NSString *memo;
@property(strong , nonatomic) NSString *teacher;
@end
