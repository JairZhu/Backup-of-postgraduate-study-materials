/*==============================================================*/
/* DBMS name:      SAP SQL Anywhere 17                          */
/* Created on:     2020/5/13 22:22:15                           */
/*==============================================================*/


if exists(select 1 from sys.sysforeignkey where role='FK_�����˻�_�����˻��̳�_�˻�') then
    alter table �����˻�
       delete foreign key FK_�����˻�_�����˻��̳�_�˻�
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_Ա��_����_֧��') then
    alter table Ա��
       delete foreign key FK_Ա��_����_֧��
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_Ա��_�쵼_Ա��') then
    alter table Ա��
       delete foreign key FK_Ա��_�쵼_Ա��
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_ӵ��_ӵ��_�ͻ�') then
    alter table ӵ��
       delete foreign key FK_ӵ��_ӵ��_�ͻ�
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_ӵ��_ӵ��2_�˻�') then
    alter table ӵ��
       delete foreign key FK_ӵ��_ӵ��2_�˻�
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_֧��_����-֧��_����') then
    alter table ֧��
       delete foreign key "FK_֧��_����-֧��_����"
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_֧Ʊ�˻�_֧Ʊ�˻��̳�_�˻�') then
    alter table ֧Ʊ�˻�
       delete foreign key FK_֧Ʊ�˻�_֧Ʊ�˻��̳�_�˻�
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_֧��_����_����') then
    alter table ֧��
       delete foreign key FK_֧��_����_����
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_����_1,N_����') then
    alter table ����
       delete foreign key FK_����_1,N_����
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_����_1,N2_�ͻ�') then
    alter table ����
       delete foreign key FK_����_1,N2_�ͻ�
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_����_����_�ͻ�') then
    alter table ����
       delete foreign key FK_����_����_�ͻ�
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_����_����2_Ա��') then
    alter table ����
       delete foreign key FK_����_����2_Ա��
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_�˻�_��ͨ_֧��') then
    alter table �˻�
       delete foreign key FK_�˻�_��ͨ_֧��
end if;

drop index if exists �����˻�.�����˻�_PK;

drop table if exists �����˻�;

drop index if exists Ա��.�쵼_FK;

drop index if exists Ա��.����_FK;

drop index if exists Ա��.Ա��_PK;

drop table if exists Ա��;

drop index if exists �ͻ�.�ͻ�_PK;

drop table if exists �ͻ�;

drop index if exists ӵ��.ӵ��2_FK;

drop index if exists ӵ��.ӵ��_FK;

drop index if exists ӵ��.ӵ��_PK;

drop table if exists ӵ��;

drop index if exists ֧��."����-֧��_FK";

drop table if exists ֧��;

drop index if exists ֧Ʊ�˻�.֧Ʊ�˻�_PK;

drop table if exists ֧Ʊ�˻�;

drop index if exists ֧��.����_FK;

drop index if exists ֧��.֧��_PK;

drop table if exists ֧��;

drop index if exists ����."1,n2_FK";

drop index if exists ����."1,n_FK";

drop index if exists ����.����_PK;

drop table if exists ����;

drop index if exists ����.����2_FK;

drop index if exists ����.����_FK;

drop index if exists ����.����_PK;

drop table if exists ����;

drop index if exists �˻�.��ͨ_FK;

drop index if exists �˻�.�˻�_PK;

drop table if exists �˻�;

drop index if exists ����.����_PK;

drop table if exists ����;

/*==============================================================*/
/* Table: �����˻�                                                  */
/*==============================================================*/
create or replace table �����˻� 
(
   �˻���                  char(30)                       not null,
   ֧����                  varchar(50)                    null,
   ���                   numeric(8,2)                   null,
   ����                   decimal                        null,
   constraint PK_�����˻� primary key clustered (�˻���)
);

/*==============================================================*/
/* Index: �����˻�_PK                                               */
/*==============================================================*/
create unique clustered index �����˻�_PK on �����˻� (
�˻��� ASC
);

/*==============================================================*/
/* Table: Ա��                                                    */
/*==============================================================*/
create or replace table Ա�� 
(
   ���֤                  char(20)                       not null,
   Ա��_���֤               char(20)                       null,
   ֧����                  varchar(50)                    not null,
   ����                   varchar(50)                    null,
   �绰����                 char(20)                       null,
   ��ͥסַ                 varchar(50)                    null,
   ��ʼ����ʱ��               date                           null,
   constraint PK_Ա�� primary key clustered (���֤)
);

/*==============================================================*/
/* Index: Ա��_PK                                                 */
/*==============================================================*/
create unique clustered index Ա��_PK on Ա�� (
���֤ ASC
);

/*==============================================================*/
/* Index: ����_FK                                                 */
/*==============================================================*/
create index ����_FK on Ա�� (
֧���� ASC
);

/*==============================================================*/
/* Index: �쵼_FK                                                 */
/*==============================================================*/
create index �쵼_FK on Ա�� (
Ա��_���֤ ASC
);

/*==============================================================*/
/* Table: �ͻ�                                                    */
/*==============================================================*/
create or replace table �ͻ� 
(
   ���֤��                 char(20)                       not null,
   ����                   varchar(50)                    null,
   �ֵ�                   varchar(50)                    null,
   ����                   varchar(50)                    null,
   constraint PK_�ͻ� primary key clustered (���֤��)
);

/*==============================================================*/
/* Index: �ͻ�_PK                                                 */
/*==============================================================*/
create unique clustered index �ͻ�_PK on �ͻ� (
���֤�� ASC
);

/*==============================================================*/
/* Table: ӵ��                                                    */
/*==============================================================*/
create or replace table ӵ�� 
(
   ���֤��                 char(20)                       not null,
   �˻���                  char(30)                       not null,
   �������ʱ��               date                           null,
   constraint PK_ӵ�� primary key clustered (���֤��, �˻���)
);

/*==============================================================*/
/* Index: ӵ��_PK                                                 */
/*==============================================================*/
create unique clustered index ӵ��_PK on ӵ�� (
���֤�� ASC,
�˻��� ASC
);

/*==============================================================*/
/* Index: ӵ��_FK                                                 */
/*==============================================================*/
create index ӵ��_FK on ӵ�� (
���֤�� ASC
);

/*==============================================================*/
/* Index: ӵ��2_FK                                                */
/*==============================================================*/
create index ӵ��2_FK on ӵ�� (
�˻��� ASC
);

/*==============================================================*/
/* Table: ֧��                                                    */
/*==============================================================*/
create or replace table ֧�� 
(
   �����                  char(50)                       not null,
   ֧������                 char(20)                       null
);

/*==============================================================*/
/* Index: "����-֧��_FK"                                            */
/*==============================================================*/
create index "����-֧��_FK" on ֧�� (
����� ASC
);

/*==============================================================*/
/* Table: ֧Ʊ�˻�                                                  */
/*==============================================================*/
create or replace table ֧Ʊ�˻� 
(
   �˻���                  char(30)                       not null,
   ֧����                  varchar(50)                    null,
   ���                   numeric(8,2)                   null,
   ͸֧��                  numeric(8,2)                   null,
   constraint PK_֧Ʊ�˻� primary key clustered (�˻���)
);

/*==============================================================*/
/* Index: ֧Ʊ�˻�_PK                                               */
/*==============================================================*/
create unique clustered index ֧Ʊ�˻�_PK on ֧Ʊ�˻� (
�˻��� ASC
);

/*==============================================================*/
/* Table: ֧��                                                    */
/*==============================================================*/
create or replace table ֧�� 
(
   ֧����                  varchar(50)                    not null,
   �����                  char(50)                       not null,
   ����                   varchar(50)                    null,
   �ʲ�                   numeric(8,2)                   null,
   constraint PK_֧�� primary key clustered (֧����)
);

/*==============================================================*/
/* Index: ֧��_PK                                                 */
/*==============================================================*/
create unique clustered index ֧��_PK on ֧�� (
֧���� ASC
);

/*==============================================================*/
/* Index: ����_FK                                                 */
/*==============================================================*/
create index ����_FK on ֧�� (
����� ASC
);

/*==============================================================*/
/* Table: ����                                                    */
/*==============================================================*/
create or replace table ���� 
(
   �����                  char(50)                       not null,
   ���֤��                 char(20)                       not null,
   constraint PK_���� primary key clustered (�����, ���֤��)
);

/*==============================================================*/
/* Index: ����_PK                                                 */
/*==============================================================*/
create unique clustered index ����_PK on ���� (
����� ASC,
���֤�� ASC
);

/*==============================================================*/
/* Index: "1,n_FK"                                              */
/*==============================================================*/
create index "1,n_FK" on ���� (
����� ASC
);

/*==============================================================*/
/* Index: "1,n2_FK"                                             */
/*==============================================================*/
create index "1,n2_FK" on ���� (
���֤�� ASC
);

/*==============================================================*/
/* Table: ����                                                    */
/*==============================================================*/
create or replace table ���� 
(
   ���֤��                 char(20)                       not null,
   ���֤                  char(20)                       not null,
   ���                   varchar(20)                    null,
   constraint PK_���� primary key clustered (���֤��, ���֤)
);

/*==============================================================*/
/* Index: ����_PK                                                 */
/*==============================================================*/
create unique clustered index ����_PK on ���� (
���֤�� ASC,
���֤ ASC
);

/*==============================================================*/
/* Index: ����_FK                                                 */
/*==============================================================*/
create index ����_FK on ���� (
���֤�� ASC
);

/*==============================================================*/
/* Index: ����2_FK                                                */
/*==============================================================*/
create index ����2_FK on ���� (
���֤ ASC
);

/*==============================================================*/
/* Table: �˻�                                                    */
/*==============================================================*/
create or replace table �˻� 
(
   �˻���                  char(30)                       not null,
   ֧����                  varchar(50)                    not null,
   ���                   numeric(8,2)                   null,
   constraint PK_�˻� primary key clustered (�˻���)
);

/*==============================================================*/
/* Index: �˻�_PK                                                 */
/*==============================================================*/
create unique clustered index �˻�_PK on �˻� (
�˻��� ASC
);

/*==============================================================*/
/* Index: ��ͨ_FK                                                 */
/*==============================================================*/
create index ��ͨ_FK on �˻� (
֧���� ASC
);

/*==============================================================*/
/* Table: ����                                                    */
/*==============================================================*/
create or replace table ���� 
(
   �����                  char(50)                       not null,
   ���                   numeric(8,2)                   null,
   constraint PK_���� primary key clustered (�����)
);

/*==============================================================*/
/* Index: ����_PK                                                 */
/*==============================================================*/
create unique clustered index ����_PK on ���� (
����� ASC
);

alter table �����˻�
   add constraint FK_�����˻�_�����˻��̳�_�˻� foreign key (�˻���)
      references �˻� (�˻���)
      on update restrict
      on delete restrict;

alter table Ա��
   add constraint FK_Ա��_����_֧�� foreign key (֧����)
      references ֧�� (֧����)
      on update restrict
      on delete restrict;

alter table Ա��
   add constraint FK_Ա��_�쵼_Ա�� foreign key (Ա��_���֤)
      references Ա�� (���֤)
      on update restrict
      on delete restrict;

alter table ӵ��
   add constraint FK_ӵ��_ӵ��_�ͻ� foreign key (���֤��)
      references �ͻ� (���֤��)
      on update restrict
      on delete restrict;

alter table ӵ��
   add constraint FK_ӵ��_ӵ��2_�˻� foreign key (�˻���)
      references �˻� (�˻���)
      on update restrict
      on delete restrict;

alter table ֧��
   add constraint "FK_֧��_����-֧��_����" foreign key (�����)
      references ���� (�����)
      on update restrict
      on delete restrict;

alter table ֧Ʊ�˻�
   add constraint FK_֧Ʊ�˻�_֧Ʊ�˻��̳�_�˻� foreign key (�˻���)
      references �˻� (�˻���)
      on update restrict
      on delete restrict;

alter table ֧��
   add constraint FK_֧��_����_���� foreign key (�����)
      references ���� (�����)
      on update restrict
      on delete restrict;

alter table ����
   add constraint FK_����_1,N_���� foreign key (�����)
      references ���� (�����)
      on update restrict
      on delete restrict;

alter table ����
   add constraint FK_����_1,N2_�ͻ� foreign key (���֤��)
      references �ͻ� (���֤��)
      on update restrict
      on delete restrict;

alter table ����
   add constraint FK_����_����_�ͻ� foreign key (���֤��)
      references �ͻ� (���֤��)
      on update restrict
      on delete restrict;

alter table ����
   add constraint FK_����_����2_Ա�� foreign key (���֤)
      references Ա�� (���֤)
      on update restrict
      on delete restrict;

alter table �˻�
   add constraint FK_�˻�_��ͨ_֧�� foreign key (֧����)
      references ֧�� (֧����)
      on update restrict
      on delete restrict;

