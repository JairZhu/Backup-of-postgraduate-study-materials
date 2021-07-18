/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2021/4/15 16:55:14                           */
/*==============================================================*/

create database homework2;

use homework2;

drop table if exists department;

drop table if exists project;

drop table if exists staff;

drop table if exists staff_project;

/*==============================================================*/
/* Table: department                                            */
/*==============================================================*/
create table department
(
   department_no        decimal(64) not null,
   department_name      char(20) not null,
   primary key (department_no)
);

/*==============================================================*/
/* Table: project                                               */
/*==============================================================*/
create table project
(
   project_no           decimal(64) not null,
   department_no        decimal(64) not null,
   project_name         char(50) not null,
   bank_account         decimal(64) not null,
   primary key (project_no)
);

/*==============================================================*/
/* Table: staff                                                 */
/*==============================================================*/
create table staff
(
   staff_no             decimal(64) not null,
   department_no        decimal(64) not null,
   staff_name           char(20) not null,
   sex                  bool not null,
   primary key (staff_no)
);

/*==============================================================*/
/* Table: staff_project                                         */
/*==============================================================*/
create table staff_project
(
   staff_no             decimal(64) not null,
   project_no           decimal(64) not null,
   reward               float not null,
   primary key (staff_no, project_no)
);

alter table project add constraint FK_department_project foreign key (department_no)
      references department (department_no) on delete restrict on update restrict;

alter table staff add constraint FK_department_staff foreign key (department_no)
      references department (department_no) on delete restrict on update restrict;

alter table staff_project add constraint FK_completion foreign key (staff_no)
      references staff (staff_no) on delete restrict on update restrict;

alter table staff_project add constraint FK_completion2 foreign key (project_no)
      references project (project_no) on delete restrict on update restrict;

