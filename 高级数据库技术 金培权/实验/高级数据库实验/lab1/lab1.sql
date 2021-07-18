/*==============================================================*/
/* DBMS name:      SAP SQL Anywhere 17                          */
/* Created on:     2020/5/13 22:22:15                           */
/*==============================================================*/


if exists(select 1 from sys.sysforeignkey where role='FK_储蓄账户_储蓄账户继承_账户') then
    alter table 储蓄账户
       delete foreign key FK_储蓄账户_储蓄账户继承_账户
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_员工_工作_支行') then
    alter table 员工
       delete foreign key FK_员工_工作_支行
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_员工_领导_员工') then
    alter table 员工
       delete foreign key FK_员工_领导_员工
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_拥有_拥有_客户') then
    alter table 拥有
       delete foreign key FK_拥有_拥有_客户
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_拥有_拥有2_账户') then
    alter table 拥有
       delete foreign key FK_拥有_拥有2_账户
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_支付_贷款-支付_贷款') then
    alter table 支付
       delete foreign key "FK_支付_贷款-支付_贷款"
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_支票账户_支票账户继承_账户') then
    alter table 支票账户
       delete foreign key FK_支票账户_支票账户继承_账户
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_支行_发放_贷款') then
    alter table 支行
       delete foreign key FK_支行_发放_贷款
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_申请_1,N_贷款') then
    alter table 申请
       delete foreign key FK_申请_1,N_贷款
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_申请_1,N2_客户') then
    alter table 申请
       delete foreign key FK_申请_1,N2_客户
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_负责_负责_客户') then
    alter table 负责
       delete foreign key FK_负责_负责_客户
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_负责_负责2_员工') then
    alter table 负责
       delete foreign key FK_负责_负责2_员工
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_账户_开通_支行') then
    alter table 账户
       delete foreign key FK_账户_开通_支行
end if;

drop index if exists 储蓄账户.储蓄账户_PK;

drop table if exists 储蓄账户;

drop index if exists 员工.领导_FK;

drop index if exists 员工.工作_FK;

drop index if exists 员工.员工_PK;

drop table if exists 员工;

drop index if exists 客户.客户_PK;

drop table if exists 客户;

drop index if exists 拥有.拥有2_FK;

drop index if exists 拥有.拥有_FK;

drop index if exists 拥有.拥有_PK;

drop table if exists 拥有;

drop index if exists 支付."贷款-支付_FK";

drop table if exists 支付;

drop index if exists 支票账户.支票账户_PK;

drop table if exists 支票账户;

drop index if exists 支行.发放_FK;

drop index if exists 支行.支行_PK;

drop table if exists 支行;

drop index if exists 申请."1,n2_FK";

drop index if exists 申请."1,n_FK";

drop index if exists 申请.申请_PK;

drop table if exists 申请;

drop index if exists 负责.负责2_FK;

drop index if exists 负责.负责_FK;

drop index if exists 负责.负责_PK;

drop table if exists 负责;

drop index if exists 账户.开通_FK;

drop index if exists 账户.账户_PK;

drop table if exists 账户;

drop index if exists 贷款.贷款_PK;

drop table if exists 贷款;

/*==============================================================*/
/* Table: 储蓄账户                                                  */
/*==============================================================*/
create or replace table 储蓄账户 
(
   账户号                  char(30)                       not null,
   支行名                  varchar(50)                    null,
   余额                   numeric(8,2)                   null,
   利率                   decimal                        null,
   constraint PK_储蓄账户 primary key clustered (账户号)
);

/*==============================================================*/
/* Index: 储蓄账户_PK                                               */
/*==============================================================*/
create unique clustered index 储蓄账户_PK on 储蓄账户 (
账户号 ASC
);

/*==============================================================*/
/* Table: 员工                                                    */
/*==============================================================*/
create or replace table 员工 
(
   身份证                  char(20)                       not null,
   员工_身份证               char(20)                       null,
   支行名                  varchar(50)                    not null,
   姓名                   varchar(50)                    null,
   电话号码                 char(20)                       null,
   家庭住址                 varchar(50)                    null,
   开始工作时间               date                           null,
   constraint PK_员工 primary key clustered (身份证)
);

/*==============================================================*/
/* Index: 员工_PK                                                 */
/*==============================================================*/
create unique clustered index 员工_PK on 员工 (
身份证 ASC
);

/*==============================================================*/
/* Index: 工作_FK                                                 */
/*==============================================================*/
create index 工作_FK on 员工 (
支行名 ASC
);

/*==============================================================*/
/* Index: 领导_FK                                                 */
/*==============================================================*/
create index 领导_FK on 员工 (
员工_身份证 ASC
);

/*==============================================================*/
/* Table: 客户                                                    */
/*==============================================================*/
create or replace table 客户 
(
   身份证号                 char(20)                       not null,
   姓名                   varchar(50)                    null,
   街道                   varchar(50)                    null,
   城市                   varchar(50)                    null,
   constraint PK_客户 primary key clustered (身份证号)
);

/*==============================================================*/
/* Index: 客户_PK                                                 */
/*==============================================================*/
create unique clustered index 客户_PK on 客户 (
身份证号 ASC
);

/*==============================================================*/
/* Table: 拥有                                                    */
/*==============================================================*/
create or replace table 拥有 
(
   身份证号                 char(20)                       not null,
   账户号                  char(30)                       not null,
   最近访问时间               date                           null,
   constraint PK_拥有 primary key clustered (身份证号, 账户号)
);

/*==============================================================*/
/* Index: 拥有_PK                                                 */
/*==============================================================*/
create unique clustered index 拥有_PK on 拥有 (
身份证号 ASC,
账户号 ASC
);

/*==============================================================*/
/* Index: 拥有_FK                                                 */
/*==============================================================*/
create index 拥有_FK on 拥有 (
身份证号 ASC
);

/*==============================================================*/
/* Index: 拥有2_FK                                                */
/*==============================================================*/
create index 拥有2_FK on 拥有 (
账户号 ASC
);

/*==============================================================*/
/* Table: 支付                                                    */
/*==============================================================*/
create or replace table 支付 
(
   贷款号                  char(50)                       not null,
   支付次数                 char(20)                       null
);

/*==============================================================*/
/* Index: "贷款-支付_FK"                                            */
/*==============================================================*/
create index "贷款-支付_FK" on 支付 (
贷款号 ASC
);

/*==============================================================*/
/* Table: 支票账户                                                  */
/*==============================================================*/
create or replace table 支票账户 
(
   账户号                  char(30)                       not null,
   支行名                  varchar(50)                    null,
   余额                   numeric(8,2)                   null,
   透支额                  numeric(8,2)                   null,
   constraint PK_支票账户 primary key clustered (账户号)
);

/*==============================================================*/
/* Index: 支票账户_PK                                               */
/*==============================================================*/
create unique clustered index 支票账户_PK on 支票账户 (
账户号 ASC
);

/*==============================================================*/
/* Table: 支行                                                    */
/*==============================================================*/
create or replace table 支行 
(
   支行名                  varchar(50)                    not null,
   贷款号                  char(50)                       not null,
   城市                   varchar(50)                    null,
   资产                   numeric(8,2)                   null,
   constraint PK_支行 primary key clustered (支行名)
);

/*==============================================================*/
/* Index: 支行_PK                                                 */
/*==============================================================*/
create unique clustered index 支行_PK on 支行 (
支行名 ASC
);

/*==============================================================*/
/* Index: 发放_FK                                                 */
/*==============================================================*/
create index 发放_FK on 支行 (
贷款号 ASC
);

/*==============================================================*/
/* Table: 申请                                                    */
/*==============================================================*/
create or replace table 申请 
(
   贷款号                  char(50)                       not null,
   身份证号                 char(20)                       not null,
   constraint PK_申请 primary key clustered (贷款号, 身份证号)
);

/*==============================================================*/
/* Index: 申请_PK                                                 */
/*==============================================================*/
create unique clustered index 申请_PK on 申请 (
贷款号 ASC,
身份证号 ASC
);

/*==============================================================*/
/* Index: "1,n_FK"                                              */
/*==============================================================*/
create index "1,n_FK" on 申请 (
贷款号 ASC
);

/*==============================================================*/
/* Index: "1,n2_FK"                                             */
/*==============================================================*/
create index "1,n2_FK" on 申请 (
身份证号 ASC
);

/*==============================================================*/
/* Table: 负责                                                    */
/*==============================================================*/
create or replace table 负责 
(
   身份证号                 char(20)                       not null,
   身份证                  char(20)                       not null,
   身份                   varchar(20)                    null,
   constraint PK_负责 primary key clustered (身份证号, 身份证)
);

/*==============================================================*/
/* Index: 负责_PK                                                 */
/*==============================================================*/
create unique clustered index 负责_PK on 负责 (
身份证号 ASC,
身份证 ASC
);

/*==============================================================*/
/* Index: 负责_FK                                                 */
/*==============================================================*/
create index 负责_FK on 负责 (
身份证号 ASC
);

/*==============================================================*/
/* Index: 负责2_FK                                                */
/*==============================================================*/
create index 负责2_FK on 负责 (
身份证 ASC
);

/*==============================================================*/
/* Table: 账户                                                    */
/*==============================================================*/
create or replace table 账户 
(
   账户号                  char(30)                       not null,
   支行名                  varchar(50)                    not null,
   余额                   numeric(8,2)                   null,
   constraint PK_账户 primary key clustered (账户号)
);

/*==============================================================*/
/* Index: 账户_PK                                                 */
/*==============================================================*/
create unique clustered index 账户_PK on 账户 (
账户号 ASC
);

/*==============================================================*/
/* Index: 开通_FK                                                 */
/*==============================================================*/
create index 开通_FK on 账户 (
支行名 ASC
);

/*==============================================================*/
/* Table: 贷款                                                    */
/*==============================================================*/
create or replace table 贷款 
(
   贷款号                  char(50)                       not null,
   金额                   numeric(8,2)                   null,
   constraint PK_贷款 primary key clustered (贷款号)
);

/*==============================================================*/
/* Index: 贷款_PK                                                 */
/*==============================================================*/
create unique clustered index 贷款_PK on 贷款 (
贷款号 ASC
);

alter table 储蓄账户
   add constraint FK_储蓄账户_储蓄账户继承_账户 foreign key (账户号)
      references 账户 (账户号)
      on update restrict
      on delete restrict;

alter table 员工
   add constraint FK_员工_工作_支行 foreign key (支行名)
      references 支行 (支行名)
      on update restrict
      on delete restrict;

alter table 员工
   add constraint FK_员工_领导_员工 foreign key (员工_身份证)
      references 员工 (身份证)
      on update restrict
      on delete restrict;

alter table 拥有
   add constraint FK_拥有_拥有_客户 foreign key (身份证号)
      references 客户 (身份证号)
      on update restrict
      on delete restrict;

alter table 拥有
   add constraint FK_拥有_拥有2_账户 foreign key (账户号)
      references 账户 (账户号)
      on update restrict
      on delete restrict;

alter table 支付
   add constraint "FK_支付_贷款-支付_贷款" foreign key (贷款号)
      references 贷款 (贷款号)
      on update restrict
      on delete restrict;

alter table 支票账户
   add constraint FK_支票账户_支票账户继承_账户 foreign key (账户号)
      references 账户 (账户号)
      on update restrict
      on delete restrict;

alter table 支行
   add constraint FK_支行_发放_贷款 foreign key (贷款号)
      references 贷款 (贷款号)
      on update restrict
      on delete restrict;

alter table 申请
   add constraint FK_申请_1,N_贷款 foreign key (贷款号)
      references 贷款 (贷款号)
      on update restrict
      on delete restrict;

alter table 申请
   add constraint FK_申请_1,N2_客户 foreign key (身份证号)
      references 客户 (身份证号)
      on update restrict
      on delete restrict;

alter table 负责
   add constraint FK_负责_负责_客户 foreign key (身份证号)
      references 客户 (身份证号)
      on update restrict
      on delete restrict;

alter table 负责
   add constraint FK_负责_负责2_员工 foreign key (身份证)
      references 员工 (身份证)
      on update restrict
      on delete restrict;

alter table 账户
   add constraint FK_账户_开通_支行 foreign key (支行名)
      references 支行 (支行名)
      on update restrict
      on delete restrict;

