/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2021/4/10 13:58:32                           */
/*==============================================================*/
create database Bank;

use Bank;

drop table if exists Bank_branch;

drop table if exists Bank_checking_accounts;

drop table if exists Bank_customer_checking_account;

drop table if exists Bank_customer_loan;

drop table if exists Bank_customer_saving_account;

drop table if exists Bank_customers;

drop table if exists Bank_departments;

drop table if exists Bank_employees;

drop table if exists Bank_loans;

drop table if exists Bank_payment;

drop table if exists Bank_saving_accounts;

/*==============================================================*/
/* Table: Bank_branch                                           */
/*==============================================================*/
create table Bank_branch
(
   branch_name          varchar(50) not null,
   branch_city          varchar(10),
   branch_property      float,
   primary key (branch_name)
);

/*==============================================================*/
/* Table: Bank_checking_accounts                                */
/*==============================================================*/
create table Bank_checking_accounts
(
   account_ID           int(64) not null,
   balance              float,
   branch_name          varchar(50),
   overdraft            float,
   primary key (account_ID)
);

/*==============================================================*/
/* Table: Bank_customer_checking_account                        */
/*==============================================================*/
create table Bank_customer_checking_account
(
   customer_ID          varchar(18) not null,
   account_ID           int(64) not null,
   visit_date           date,
   employee_ID          varchar(18),
   primary key (customer_ID, account_ID)
);

/*==============================================================*/
/* Table: Bank_customer_loan                                    */
/*==============================================================*/
create table Bank_customer_loan
(
   customer_ID          varchar(18) not null,
   loan_ID              int(64) not null,
   loan_amount          float not null,
   employee_ID          varchar(18),
   primary key (customer_ID, loan_ID, loan_amount)
);

/*==============================================================*/
/* Table: Bank_customer_saving_account                          */
/*==============================================================*/
create table Bank_customer_saving_account
(
   customer_ID          varchar(18) not null,
   account_ID           int(64) not null,
   visit_date           date,
   employee_ID          varchar(18),
   primary key (customer_ID, account_ID)
);

/*==============================================================*/
/* Table: Bank_customers                                        */
/*==============================================================*/
create table Bank_customers
(
   customer_ID          varchar(18) not null,
   customer_name        varchar(10),
   customer_address     varchar(50),
   primary key (customer_ID)
);

/*==============================================================*/
/* Table: Bank_departments                                      */
/*==============================================================*/
create table Bank_departments
(
   employee_ID          varchar(18) not null,
   department           varchar(20),
   primary key (employee_ID)
);

/*==============================================================*/
/* Table: Bank_employees                                        */
/*==============================================================*/
create table Bank_employees
(
   employee_ID          varchar(18) not null,
   employee_name        varchar(10),
   employee_phone_number varchar(11),
   employee_address     varchar(50),
   employee_start_date  date,
   Ban_employee_ID      varchar(18),
   primary key (employee_ID)
);

/*==============================================================*/
/* Table: Bank_loans                                            */
/*==============================================================*/
create table Bank_loans
(
   loan_ID              int(64) not null,
   branch_name          varchar(50),
   loan_amount          float not null,
   primary key (loan_ID)
);

/*==============================================================*/
/* Table: Bank_payment                                          */
/*==============================================================*/
create table Bank_payment
(
   payment_ID           int(64) not null,
   loan_ID              int(64),
   payment_amount       float,
   date                 date,
   primary key (payment_ID)
);

/*==============================================================*/
/* Table: Bank_saving_accounts                                  */
/*==============================================================*/
create table Bank_saving_accounts
(
   account_ID           int(64) not null,
   balance              float,
   branch_name          varchar(50),
   interest_rate        float,
   primary key (account_ID)
);

alter table Bank_checking_accounts add constraint FK_Reference_3 foreign key (branch_name)
      references Bank_branch (branch_name) on delete restrict on update restrict;

alter table Bank_customer_checking_account add constraint FK_Reference_14 foreign key (employee_ID)
      references Bank_employees (employee_ID) on delete restrict on update restrict;

alter table Bank_customer_checking_account add constraint FK_Reference_6 foreign key (customer_ID)
      references Bank_customers (customer_ID) on delete restrict on update restrict;

alter table Bank_customer_checking_account add constraint FK_Reference_7 foreign key (account_ID)
      references Bank_checking_accounts (account_ID) on delete restrict on update restrict;

alter table Bank_customer_loan add constraint FK_Reference_10 foreign key (loan_ID)
      references Bank_loans (loan_ID) on delete restrict on update restrict;

alter table Bank_customer_loan add constraint FK_Reference_11 foreign key (customer_ID)
      references Bank_customers (customer_ID) on delete restrict on update restrict;

alter table Bank_customer_loan add constraint FK_Reference_15 foreign key (employee_ID)
      references Bank_employees (employee_ID) on delete restrict on update restrict;

alter table Bank_customer_saving_account add constraint FK_Reference_13 foreign key (employee_ID)
      references Bank_employees (employee_ID) on delete restrict on update restrict;

alter table Bank_customer_saving_account add constraint FK_Reference_4 foreign key (customer_ID)
      references Bank_customers (customer_ID) on delete restrict on update restrict;

alter table Bank_customer_saving_account add constraint FK_Reference_5 foreign key (account_ID)
      references Bank_saving_accounts (account_ID) on delete restrict on update restrict;

alter table Bank_departments add constraint FK_Reference_18 foreign key (employee_ID)
      references Bank_employees (employee_ID) on delete restrict on update restrict;

alter table Bank_employees add constraint FK_Reference_17 foreign key (Ban_employee_ID)
      references Bank_employees (employee_ID) on delete restrict on update restrict;

alter table Bank_loans add constraint FK_Reference_19 foreign key (branch_name)
      references Bank_branch (branch_name) on delete restrict on update restrict;

alter table Bank_payment add constraint FK_Reference_16 foreign key (loan_ID)
      references Bank_loans (loan_ID) on delete restrict on update restrict;

alter table Bank_saving_accounts add constraint FK_Reference_2 foreign key (branch_name)
      references Bank_branch (branch_name) on delete restrict on update restrict;

