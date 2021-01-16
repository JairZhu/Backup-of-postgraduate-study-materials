//
//  Student.m
//  StudentScore
//
//  Created by Jairzhu on 21-1-6.
//  Copyright (c) 2021年 Jairzhu. All rights reserved.
//

#import "Student.h"

@implementation Student
-(void)encodeWithCoder:(NSCoder *)aCoder
{
    [aCoder encodeObject:self.name forKey:@"name"];
    [aCoder encodeObject:self.number forKey:@"number"];
    [aCoder encodeInteger:self.age forKey:@"age"];
    [aCoder encodeFloat:self.score forKey:@"score"];
    //[aCoder encodeFloat:self.score forKey:@"score"];
    [aCoder encodeObject:self.memo forKey:@"memo"];
}
-(id)initWithCoder:(NSCoder *)aDecoder
{
    if(self=[super init]){
        self.name=[aDecoder decodeObjectForKey:@"name"];
        self.number=[aDecoder decodeObjectForKey:@"number"];
        self.age=[aDecoder decodeIntegerForKey:@"age"];
        self.score=[aDecoder decodeFloatForKey:@"score"];
        self.memo=[aDecoder decodeObjectForKey:@"memo"];
        self.teacher=[aDecoder decodeObjectForKey:@"teacher"];
    }
    return  self;
}
@end
