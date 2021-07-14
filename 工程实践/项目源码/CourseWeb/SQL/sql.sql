create database courseWeb;

use courseweb;

create table `user` (
    `name` varchar(50) not null ,
    `password` varchar(50) not null ,
    `type` bool not null ,
    primary key (name)
);

create table `ppt` (
    `title` varchar(100) not null ,
    `writer` varchar(50) not null ,
    `time` timestamp not null ,
    primary key (title),
    foreign key (writer) references user(name) on delete cascade on update cascade
);

create table `video` (
    `title` varchar(100) not null ,
    `writer` varchar(50) not null ,
    `time` timestamp not null ,
    primary key (title),
    foreign key (writer) references user(name) on delete cascade on update cascade
);

create table `news` (
    `title` varchar(100) not null ,
    `content` varchar(10000) not null ,
    `writer` varchar(50) not null ,
    `time` timestamp not null ,
    primary key (title),
    foreign key (writer) references user(name) on delete cascade on update cascade
);


create table `notification` (
    `title` varchar(100) not null ,
    `content` varchar(10000) not null ,
    `writer` varchar(50) not null ,
    `time` timestamp not null ,
    primary key (title),
    foreign key (writer) references user(name) on delete cascade on update cascade
);

create table `assignment` (
    `title` varchar(100) not null ,
    `content` varchar(10000) not null ,
    `writer` varchar(50) not null ,
    `time` timestamp not null ,
    primary key (title),
    foreign key (writer) references user(name) on delete cascade on update cascade
);

create table `homework` (
  `title` varchar(100) not null ,
  `content` varchar(10000),
  `fileName` varchar(1000),
  `writer` varchar(50) not null ,
  `time` timestamp not null ,
  `score` int ,
  primary key (title),
  foreign key (writer) references user(name) on delete cascade on update cascade
);

create table `courseInformation` (
    `title` varchar(100) not null ,
    `content` varchar(10000) not null ,
    `writer` varchar(50) not null ,
    `time` timestamp not null ,
    primary key (title),
    foreign key (writer) references user(name) on delete cascade on update cascade
);

create table `comment` (
    `id` int auto_increment not null ,
    `title` varchar(100) not null,
    `content` varchar(1000) not null,
    `writer` varchar(50) not null ,
    `counterpart` varchar(50) not null,
    `reference` varchar(1000) not null,
    `time` timestamp not null ,
    primary key (id),
    foreign key (writer) references user(name) on delete cascade on update cascade
);

insert into user values ('student', '1', false);
insert into user values ('井中月lya', '1', false);
insert into user values ('僵尸狗', '1', false);
insert into user values ('SUMi_粟米', '1', false);
insert into user values ('熊猫丢了猫', '1', false);
insert into user values ('teacher', '1', true);
insert into user values ('张波', '1', true);
insert into user values ('沈茜', '1', true);
insert into user values ('丁箐', '1', true);
insert into user values ('zkl', '1', true);

insert into comment(title, content, writer, counterpart, reference, time) values ( '架构风格和架构模式的区别是什么？', '架构风格和架构模式的区别是什么？', 'SUMi_粟米', '', '', now());

insert into comment(title, content, writer, counterpart, reference, time) values ('如何在写项目时运用学到的设计模式？', '如何在写项目时运用学到的设计模式？', '熊猫丢了猫', '', '', now());

insert into comment(title, content, writer, counterpart, reference, time) values ('GKD学生前来报道', 'GKD学生前来报道', '井中月lya', '', '', now());

insert into comment(title, content, writer, counterpart, reference, time) values ('GKD学生前来报道', '奥力给', '僵尸狗', '井中月lya', 'GKD学生前来报道', now());

insert into courseInformation values ('教学大纲', '课程编号：EIEN6008P

英文名称：Software Architecture

开课单位：225-软件学院

学分：　　3

讲授学时：80

实验学时：15

上课专业：CS计算机

预修课程：操作系统、计算机网络、计算机组成原理、数据结构

参考教材：dive into design patterns

课程简介：
        软件体系结构是具有一定形式的结构化元素，即构件的集合，包括处理构件、数据构件和连接构件。处理构件负责对数据进行加工，数据构件是被加工的信息，连接构件把体系结构的不同部分组合连接起来。这一定义注重区分处理构件、数据构件和连接构件，这一方法在其他的定义和方法中基本上得到保持。相比较于“软件架构”,“软件体系结构”一词多用于学术研究领域使用，“软件架构”多用于工程实践领域，二者的外文名都是“software architecture”，在IEEE中的定义均为：“一个系统的基础组织，包含各个构件、构件互相之间与环境的关系，还有指导其设计和演化的原则。”',
                                      '丁箐', now());

insert into news values ('2020级软设4班(合肥)举办主题团日学习活动', '12月31日，软设4班在软件学院202教室举办了主题团日学习活动，共同观看了由中国科大策划推出的微电影《月是故乡明》并学习了其中的精神。本次活动出勤率很高，大家都度过了愉快而有意义的2个小时。

电影开始前，班长杨震同学首先介绍了电影了主题和拍摄背景，影片就此开始，微电影《月是故乡明》是继微电影《永怀初心》后，中国科大重磅打造的又一历史题材微电影。本片讲述了钱临照先生一生为中国科技和教育事业作出的重要贡献。

影片结束后，大家都对观看后的自身感受进行了踊跃发言。郝嵘同学说：该片旨在纪念钱临照先生为中国科技和教育事业做出的重要贡献，缅怀老一辈科学家爱国爱校、坚守初心、潜心科教的崇高品格，弘扬科学家精神，传承科大文化，激励广大师生为建成世界一流大学而努力奋斗。我们也要向他们学习，发扬科大精神，为建设更好的中国而奋斗！本次学习内容充实而有趣。此次学习，使同学们更加深入了钱临照先生一生的贡献和伟大的精神，也更使同学们的精神境界得到了提高，同学们均表示要努力学习，为祖国的发展贡献自己的力量。',
                         '张波', now());
insert into news values ('软件学院开展“铭记历史，砥砺前行”主题党日活动', '为增强软件学院苏州校区的党员同学对校史的了解，强化作为科大学子的自豪感、使命感和责任感，树立报国之志，学院举办了“铭记历史，砥砺前行”主题教育活动，2020级共有38名学生党员参加。

12月26日下午，苏州校区的学子返回校本部，在讲解员的带领下，党员同志们分两批参观了校史馆。从国运所系、大师云集、春风化雨、气象峥嵘、南迁重建、敢为人先、开泰布新、创建一流、东风永恒、勇攀高峰十个历史展厅到少年班、师长厅、校友厅、实物厅四个专题专厅，校史馆以时为经，以实为纬，再现了科大波澜壮阔的辉煌进程。跟随着讲解员的步伐，全体党员徜徉于六十余载的历史长河中，全面了解了科大1958年建校的光荣使命、南迁合肥的艰难困苦、扎根合肥的砥砺前行，对中国科大能够在如此艰苦的条件下还能够取得如此辉煌的成就感到震撼，强化了党员同学的报国之志。

12月27日上午，学生党员共赴渡江战役纪念馆参观，追忆革命历史，缅怀革命先烈，接受革命传统教育。在讲解员的带领下，党员同志们依次参观了渡江战役馆内的战役总前委群雕、七大展厅、半景画馆、功勋长廊及千余件珍贵的革命文物，重温了那段波澜壮阔的革命历程，深切缅怀革命前辈的丰功伟绩。在生动详细的历史解说声中，党员同志们脑海中再现了当年百万雄师勇渡长江夺取胜利的恢弘景象，真切感受到革命先烈们坚如磐石的共产主义信仰，坚定了党员同学的理想信念。

在参观完渡江战役纪念馆之后，党员同志们来到安徽名人馆。八个展厅展出的安徽名人超过800位，他们活跃在各个历史时期的社会舞台上，或以文治武功流芳百世，或以思想学术立身扬名，或以诗词文赋蜚声文坛，或以妙笔丹青驰誉艺苑，或在科学技术园地大放异彩。在讲解员声情并茂的介绍下,沿着历史的轨迹，跨越时空五千年，党员同志们深刻了解了安徽名人们的不朽事迹，惊叹于他们无论是何处境，都能坚守初心，以自己的方式报效国家，服务人民。

通过此次活动，党员同志们接受了红色文化的熏陶，进一步增强了党性修养。大家纷纷表示，要时刻铭记历史，不忘初心。回去以后将以更加饱满的热情投入到学习和工作中，尽职尽责，充分发挥共产党员的先锋模范作用。',
                        '沈茜', now());
insert into news values ('一切从心开始', '为了培养我院20级新生的团队精神，尽快建立人际支持，找到集体归属感和增强合作意识，12月21日上午，在班主任唐朝舜老师的指导下，软设五班的同学开展了一次轻松、愉快的团体心理辅导活动。

本次活动以“心理感悟”和“人际沟通”主题为主。活动在轻松和谐的气氛中开始，在源心咨询朱老师的组织下，同学们相互介绍自己并说明参加本次活动的理由和目的，增进了同学间的相互了解。

在“心理感悟”中朱老师带领大家想象倾听自己的内心，伴随着讲述和音乐逐渐靠近自己内心的声音。感悟结束后，同学们在一起相互讲述心理所感所想。

在“人际沟通”环节中，在朱老师的教授下同学们明白了人类大脑的神秘进化过程、人际沟通方法和思维。

团体心理辅导不仅舒缓了同学们紧张的神经，也对同学们今后的学习生活有了一些启发。同学们表示在今后的学校集体里，会及时调整自己心态，明确自己的目标，加强与团队成员的沟通交流，树立团体合作意识，增强集体荣誉感。',
                         '沈茜', now());

insert into notification values ('关于继续接收少量2021年软件学院推免生的通知', '软件学院可继续接收少量专业学位推免生，凡已在教育部推免系统注册的考生可直接在系统内申请，预计于10月22日在苏州进行面试，具体面试安排以系统通知为准，报名截止时间为10月20日17点整。',
                                 '张波', now());

insert into notification values ('2021年软件学院接收推免生面试申请通知', '软件学院2021年拟接收4名推免生，其中2名科学学位，2名专业学位。
一、申请条件

1、原则上要求是“985”或“211”工程大学相关专业的学生；

2、已取得就读学校推荐免试研究生资格，并已在教育部推免系统注册。

二、面试申请

1、以10月15日之前在教育部推免系统申请的名单为准。

三、面试资格审核与面试安排

依据申请人填报的第一志愿的时间顺序及本科学习情况等综合因素对申请人进行审核，确定面试资格，安排面试。面试时间在10月20日左右。

特别提醒：软件学院不采用网络面试方式，所有面试均在中国科大现场进行。

四、咨询联系方式

  卞老师，0551-63492278,0551-63492157

 2020年9月27日',
                                 '张波', now());
insert into notification values ('关于2020级新生转入党团组织关系的说明', '一、党组织关系转接

安徽省以外党员组织关系需经县（市、区）级或以上党委组织部门出具介绍信至“中共安徽省教育工委”。报到当天，将党员组织关系介绍信和党员信息采集表交给迎新现场的党委组织部办理点；当天没有来得及办理的，请在入学后尽快到党委组织部（东校区218楼112房间）办理。

    介绍信抬头：中共安徽省教育工委

    介绍信组织关系接收单位：中共中国科学技术大学软件学院委员会

安徽省以内党员组织关系不需要开具纸质介绍信，由原单位党组织在网上进行转接。转入党组织关系接收单位为：中共中国科学技术大学软件学院委员会

如有问题请联系唐老师，电话：055163492028 电子邮件：rjdw@ustc.edu.cn

二、团组织关系转接

统一通过“智慧团建”系统转接到“安徽省中国科学技术大学软件学院团委”

如有问题，请联系学院团委书记卞老师，电子邮件：bxy2018@mail.ustc.edu.cn 19966467656',
                                 '沈茜', now());

insert into ppt values ('0_Guide.ppt', '丁箐', now());
insert into ppt values ('1_Overview.ppt', '丁箐', now());
insert into ppt values ('2_Architectures_In_Context.ppt', '丁箐', now());
insert into ppt values ('3_Basic_Concepts.ppt', '丁箐', now());
insert into ppt values ('4_Architectural Views.ppt', '丁箐', now());
insert into ppt values ('5_ca.ppt', '丁箐', now());
insert into ppt values ('5_ea.ppt', '丁箐', now());
insert into ppt values ('5_ia.ppt', '丁箐', now());
insert into ppt values ('6_Design the Arch.ppt', '丁箐', now());
insert into ppt values ('6_Pattern and Style I.ppt', '丁箐', now());
insert into ppt values ('6_Pattern and Style II.ppt', '丁箐', now());
insert into ppt values ('7_Distributed Architectures.ppt', '丁箐', now());
insert into ppt values ('7_Frameworks.ppt', '丁箐', now());
insert into ppt values ('7_Microservices.ppt', '丁箐', now());
insert into ppt values ('7_MVC, MVP and MVVM A Comparison of Architectural Patterns.ppt', '丁箐', now());
insert into ppt values ('7_Serverless architecture.ppt', '丁箐', now());
insert into ppt values ('7_Service Architectures.ppt', '丁箐', now());
insert into ppt values ('7_Service Oriented Architecture.ppt', '丁箐', now());
insert into ppt values ('8_Quality Attributes of Arch.-availability.ppt', '丁箐', now());
insert into ppt values ('8_Quality Attributes of Arch.-modifiability & security.ppt', '丁箐', now());
insert into ppt values ('8_Quality Attributes of Arch.-performance.ppt', '丁箐', now());
insert into ppt values ('8_Quality Attributes of Arch.-testability & usability.ppt', '丁箐', now());
insert into ppt values ('8_Quality Attributes.ppt', '丁箐', now());
insert into ppt values ('9_OO Design Principles.ppt', '丁箐', now());
insert into ppt values ('9_Refactorhelloworld.ppt', '丁箐', now());
insert into ppt values ('10_Design pattern.ppt', '丁箐', now());
insert into ppt values ('11_1 Scaling up.ppt', '丁箐', now());
insert into ppt values ('11_patterns-frameworks-middleware.ppt', '丁箐', now());

insert into assignment values ('作业1',
                               'What is Bass, Clements and Kazman’s definition of Software Architecture (the definition in the textbook)?',
                               '丁箐', now());
insert into assignment values ('作业2',
                               'Give five important reasons for why software architecture is important.',
                               '丁箐', now());
insert into assignment values ('作业3',
                               'What is the purpose of architectural views?',
                               '丁箐', now());
insert into assignment values ('作业4',
                               'Name three typical response measures for a modifiability quality attribute scenario',
                               '丁箐', now());
insert into assignment values ('作业5',
                               'Under what circumstances can be it useful to use the Composite design pattern?',
                               '丁箐', now());
insert into assignment values ('分布式机群监管系统实验',
                               '    以一个分布式机群监管系统作为例子，要求学生掌握使用各种结构视图，实现对系统结构的描述，并采用各种开源框架和具体编程技术实现该系统的简化版本。
    根据附录所列的用户需求列表，整理用户需求，完成用例图分析。根据附录提供的结构图，采用课程所描述的各种视图方法，完成对系统结构的描述。最后编程实现系统。',
                               '丁箐', now());

insert into assignment values ('作业6',
                               'Under what circumstances can be it useful to use the Composite design pattern?',
                               'teacher', now());
insert into video values ('数据结构与算法01概论.flv', 'zkl', now());
insert into video values ('数据结构与算法01-A-1计算.flv', 'zkl', now());
insert into video values ('数据结构与算法01-A-2算法有穷性.flv', 'zkl', now());
insert into video values ('数据结构与算法01-A-3好算法.flv', 'zkl', now());
insert into video values ('数据结构与算法01-B-1计算模型.flv', 'zkl', now());
insert into video values ('数据结构与算法01-B-2图灵机.flv', 'zkl', now());
insert into video values ('数据结构与算法01-B-3RAM.flv', 'zkl', now());
insert into video values ('数据结构与算法01-C-1大O.flv', 'zkl', now());
insert into video values ('数据结构与算法01-C-2bigΩ、bigΘ.flv', 'zkl', now());
insert into video values ('数据结构与算法01-C-3复杂度总结.flv', 'zkl', now());
