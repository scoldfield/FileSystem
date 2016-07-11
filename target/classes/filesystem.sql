/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.13 : Database - filesystem
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`filesystem` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `filesystem`;

/*Table structure for table `sys_borrow_audit` */

DROP TABLE IF EXISTS `sys_borrow_audit`;

CREATE TABLE `sys_borrow_audit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file_id` bigint(20) DEFAULT NULL,
  `dept_id` bigint(20) DEFAULT NULL,
  `dept_name` varchar(100) DEFAULT NULL,
  `disabled` varchar(5) DEFAULT NULL COMMENT '2:待审核;1:借出;-1:归还;0:不同意借出',
  `apply_user_id` bigint(20) DEFAULT NULL,
  `apply_user_name` varchar(100) DEFAULT NULL,
  `apply_dept_id` bigint(20) DEFAULT NULL,
  `apply_dept_name` varchar(100) DEFAULT NULL,
  `described` varchar(500) DEFAULT NULL,
  `apply_time` date DEFAULT NULL,
  `audit_time` date DEFAULT NULL,
  `operator_id` bigint(20) DEFAULT NULL,
  `operator_name` varchar(100) DEFAULT NULL,
  `return_time` date DEFAULT NULL COMMENT '归还时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `sys_borrow_audit` */

insert  into `sys_borrow_audit`(`id`,`file_id`,`dept_id`,`dept_name`,`disabled`,`apply_user_id`,`apply_user_name`,`apply_dept_id`,`apply_dept_name`,`described`,`apply_time`,`audit_time`,`operator_id`,`operator_name`,`return_time`) values (13,2,2,'融合通信部门','1',15,'融合通信部门领导用户name',2,'融合通信部门',NULL,'2016-07-10','2016-07-10',19,'融合通信部门涉密档案管理员name','2016-07-10'),(14,2,2,'融合通信部门','1',15,'融合通信部门领导用户name',2,'融合通信部门',NULL,'2016-07-10','2016-07-10',19,'融合通信部门涉密档案管理员name',NULL);

/*Table structure for table `sys_dept` */

DROP TABLE IF EXISTS `sys_dept`;

CREATE TABLE `sys_dept` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(100) DEFAULT NULL COMMENT '部门名称',
  `dept_phone` varchar(20) DEFAULT NULL COMMENT '部门电话',
  `person_num` bigint(20) DEFAULT NULL COMMENT '人口数目',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `sys_dept` */

insert  into `sys_dept`(`id`,`dept_name`,`dept_phone`,`person_num`) values (1,'终端应用产品部门','6600001',100),(2,'融合通信部门','6600002',150),(3,'开放平台部门','6600003',200),(4,'无线部门','6600004',250),(8,'呵呵','1234',10),(9,'测试部门','6600006',180);

/*Table structure for table `sys_file` */

DROP TABLE IF EXISTS `sys_file`;

CREATE TABLE `sys_file` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file_id` varchar(100) DEFAULT NULL COMMENT '档案编号',
  `file_title` varchar(100) DEFAULT NULL COMMENT '档案标题',
  `issue_user_name` varchar(100) DEFAULT NULL,
  `issue_user_id` bigint(20) DEFAULT NULL COMMENT '签发人id',
  `generate_word` varchar(100) DEFAULT NULL COMMENT '发文字号',
  `generate_type` varchar(100) DEFAULT NULL COMMENT '发文类型',
  `generate_agency` varchar(100) DEFAULT NULL COMMENT '发文机关',
  `generate_district` varchar(100) DEFAULT NULL COMMENT '发文地区',
  `generate_page` varchar(100) DEFAULT NULL COMMENT '页数',
  `generate_date` date DEFAULT NULL COMMENT '签发日期',
  `receive_user_id` bigint(20) DEFAULT NULL COMMENT '接收人id，即档案录入人的id，也即经办人id',
  `belonged_dept_id` bigint(20) DEFAULT NULL COMMENT '承办部门，即档案归属部门',
  `emergency_level` varchar(100) DEFAULT NULL COMMENT '等级',
  `secret_level` varchar(100) DEFAULT NULL COMMENT '密级',
  `auditor_id` bigint(20) DEFAULT '0' COMMENT '审核人id：即审核的档案管理员id。默认为0表示待审核',
  `audit_serials` varchar(100) DEFAULT NULL COMMENT '审核序列号',
  `audit_date` date DEFAULT NULL COMMENT '审核时间',
  `audit_result` tinyint(1) DEFAULT '0' COMMENT '审核结果：1：通过；0：未审核；-1：审核未通过',
  `filling_date` date DEFAULT NULL COMMENT '归档日期',
  `is_borrowed` tinyint(1) DEFAULT NULL COMMENT '是否被借出',
  `borrower_id` bigint(20) DEFAULT NULL COMMENT '借阅人id',
  `state` tinyint(1) DEFAULT NULL COMMENT '是否删除？1:可用; 0:不可用',
  `location` varchar(500) DEFAULT NULL COMMENT '档案上传存储的位置',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `sys_file` */

insert  into `sys_file`(`id`,`file_id`,`file_title`,`issue_user_name`,`issue_user_id`,`generate_word`,`generate_type`,`generate_agency`,`generate_district`,`generate_page`,`generate_date`,`receive_user_id`,`belonged_dept_id`,`emergency_level`,`secret_level`,`auditor_id`,`audit_serials`,`audit_date`,`audit_result`,`filling_date`,`is_borrowed`,`borrower_id`,`state`,`location`) values (1,'DA201600001','档案标题1','省长',0,'[2016]30','上级','省政府','浙江省','20','2015-01-07',0,1,'平急','机密',0,'1','2016-07-09',1,'2016-07-09',0,0,1,'Q:\\upload\\P50411-192736.jpg'),(2,'DA201600002','档案标题2','市长',0,'[2016]31','平级','杭州市政府','杭州市','30','2016-01-08',6,2,'特急','机密',18,'2','2016-07-09',1,'2016-07-09',1,15,1,'Q:\\upload\\5568592758228917986.jpg'),(3,'DA201600003','档案标题3','区长',0,'[2016]33','下级','余杭区政府','余杭区','10','2014-01-04',0,4,'平急','普通',25,'3','2016-07-09',1,'2016-07-09',0,0,1,'Q:\\upload\\ldd5.jpg'),(4,'DA201600004','档案标题4','签发人4',0,'[2016]34','下级','杭州市政府','杭州','10','2016-01-05',6,1,'特急','机密',11,'4','2016-07-09',1,'2016-07-04',0,0,1,'Q:\\upload\\u=3083956795,3665905553&fm=21&gp=0.jpg'),(5,'DA201600005','档案标题5','签发人5',0,'[2016]35','平级','合肥市政府','合肥','20','2013-01-06',11,1,'特急','绝密',11,'5','2016-07-09',1,'2016-07-03',0,0,1,NULL),(6,'DA201600006','档案标题6','签发人6',0,'[2016]36','平级','肥东县政府','肥东','10','2016-01-05',15,1,'加急','机密',0,NULL,NULL,0,NULL,0,0,1,NULL);

/*Table structure for table `sys_register_audit` */

DROP TABLE IF EXISTS `sys_register_audit`;

CREATE TABLE `sys_register_audit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `dept_id` bigint(20) DEFAULT NULL,
  `is_permitted` tinyint(1) DEFAULT NULL,
  `state` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `sys_register_audit` */

insert  into `sys_register_audit`(`id`,`user_id`,`dept_id`,`is_permitted`,`state`) values (1,23,3,NULL,1),(2,24,4,NULL,1),(3,25,4,NULL,1);

/*Table structure for table `sys_resource` */

DROP TABLE IF EXISTS `sys_resource`;

CREATE TABLE `sys_resource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `all_dept` tinyint(1) DEFAULT NULL COMMENT '是否所有部门的档案都能借阅？1:所有部门;0:本部门',
  `file_secret_level` varchar(10) DEFAULT NULL COMMENT '对应的档案的等级',
  `url` varchar(100) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `parent_ids` varchar(100) DEFAULT NULL,
  `permission` varchar(100) DEFAULT NULL,
  `state` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;

/*Data for the table `sys_resource` */

insert  into `sys_resource`(`id`,`name`,`type`,`all_dept`,`file_secret_level`,`url`,`parent_id`,`parent_ids`,`permission`,`state`) values (11,'本部门绝密级档案借阅','button',0,'绝密',NULL,NULL,NULL,NULL,0),(12,'跨部门绝密级档案借阅','button',1,'绝密',NULL,NULL,NULL,NULL,0),(13,'本部门绝密级档案接收审核','button',0,'绝密',NULL,NULL,NULL,NULL,0),(14,'跨部门绝密级档案接收审核','button',1,'绝密',NULL,NULL,NULL,NULL,0),(15,'本部门绝密级档案借阅审核','button',0,'绝密',NULL,NULL,NULL,NULL,0),(16,'跨部门绝密级档案借阅审核','button',1,'绝密',NULL,NULL,NULL,NULL,0),(17,'本部门绝密级档案信息管理','button',0,'绝密',NULL,NULL,NULL,NULL,0),(18,'跨部门绝密级档案信息管理','button',1,'绝密',NULL,NULL,NULL,NULL,0),(21,'本部门机密级档案借阅','button',0,'机密',NULL,NULL,NULL,NULL,0),(22,'跨部门机密级档案借阅','button',1,'机密',NULL,NULL,NULL,NULL,0),(23,'本部门机密级档案接收审核','button',0,'机密',NULL,NULL,NULL,NULL,0),(24,'跨部门机密级档案接收审核','button',1,'机密',NULL,NULL,NULL,NULL,0),(25,'本部门机密级档案借阅审核','button',0,'机密',NULL,NULL,NULL,NULL,0),(26,'跨部门机密级档案借阅审核','button',1,'机密',NULL,NULL,NULL,NULL,0),(27,'本部门机密级档案信息管理','button',0,'机密',NULL,NULL,NULL,NULL,0),(28,'跨部门机密级档案信息管理','button',1,'机密',NULL,NULL,NULL,NULL,0),(31,'本部门秘密级档案借阅','button',0,'秘密',NULL,NULL,NULL,NULL,0),(32,'跨部门秘密级档案借阅','button',1,'秘密',NULL,NULL,NULL,NULL,0),(33,'本部门秘密级档案接收审核','button',0,'秘密',NULL,NULL,NULL,NULL,0),(34,'跨部门秘密级档案接收审核','button',1,'秘密',NULL,NULL,NULL,NULL,0),(35,'本部门秘密级档案借阅审核','button',0,'秘密',NULL,NULL,NULL,NULL,0),(36,'跨部门秘密级档案借阅审核','button',1,'秘密',NULL,NULL,NULL,NULL,0),(37,'本部门秘密级档案信息管理','button',0,'秘密',NULL,NULL,NULL,NULL,0),(38,'跨部门秘密级档案信息管理','button',1,'秘密',NULL,NULL,NULL,NULL,0),(41,'本部门内部级档案借阅','button',0,'内部',NULL,NULL,NULL,NULL,0),(42,'跨部门内部级档案借阅','button',1,'内部',NULL,NULL,NULL,NULL,0),(43,'本部门内部级档案接收审核','button',0,'内部',NULL,NULL,NULL,NULL,0),(44,'跨部门内部级档案接收审核','button',1,'内部',NULL,NULL,NULL,NULL,0),(45,'本部门内部级档案借阅审核','button',0,'内部',NULL,NULL,NULL,NULL,0),(46,'跨部门内部级档案借阅审核','button',1,'内部',NULL,NULL,NULL,NULL,0),(47,'本部门内部级档案信息管理','button',0,'内部',NULL,NULL,NULL,NULL,0),(48,'跨部门内部级档案信息管理','button',1,'内部',NULL,NULL,NULL,NULL,0),(51,'本部门普通级档案借阅','button',0,'普通',NULL,NULL,NULL,NULL,0),(52,'跨部门普通级档案借阅','button',1,'普通',NULL,NULL,NULL,NULL,0),(53,'本部门普通级档案接收审核','button',0,'普通',NULL,NULL,NULL,NULL,0),(54,'跨部门普通级档案接收审核','button',1,'普通',NULL,NULL,NULL,NULL,0),(55,'本部门普通级档案借阅审核','button',0,'普通',NULL,NULL,NULL,NULL,0),(56,'跨部门普通级档案借阅审核','button',1,'普通',NULL,NULL,NULL,NULL,0),(57,'本部门普通级档案信息管理','button',0,'普通',NULL,NULL,NULL,NULL,0),(58,'跨部门普通级档案信息管理','button',1,'普通',NULL,NULL,NULL,NULL,0);

/*Table structure for table `sys_role` */

DROP TABLE IF EXISTS `sys_role`;

CREATE TABLE `sys_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '角色名',
  `description` varchar(100) DEFAULT NULL COMMENT '描述',
  `resource_ids` varchar(100) DEFAULT NULL COMMENT '资源',
  `type` int(4) DEFAULT NULL,
  `create_time` date DEFAULT NULL,
  `state` tinyint(1) DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `sys_role` */

insert  into `sys_role`(`id`,`name`,`description`,`resource_ids`,`type`,`create_time`,`state`) values (1,'领导用户','name','21,31,41,42,51,52,',11,NULL,NULL),(2,'涉密用户',NULL,'31,32,41,42,51,52,',12,NULL,NULL),(3,'非涉密用户',NULL,'41,42,51,52,',13,NULL,NULL),(4,'授权档案管理员(一级)',NULL,'21,23,24,25,26,27,28,31,33,34,35,36,37,38,41,42,43,44,45,46,47,48,51,52,53,54,55,56,57,58,',21,NULL,NULL),(5,'涉密档案管理员(二级)',NULL,'23,25,27,31,32,33,35,37,41,42,43,45,47,51,52,53,55,57,',22,NULL,NULL),(6,'非涉密档案管理员三级)',NULL,'41,42,43,45,47,51,52,53,55,57,',23,NULL,NULL);

/*Table structure for table `sys_user` */

DROP TABLE IF EXISTS `sys_user`;

CREATE TABLE `sys_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `job_id` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL COMMENT '密码盐',
  `name` varchar(100) DEFAULT NULL,
  `sex` tinyint(1) DEFAULT NULL COMMENT '性别：1：男；0：女',
  `dept_id` bigint(20) DEFAULT NULL,
  `dept` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL COMMENT '职务',
  `create_time` date DEFAULT NULL COMMENT '创建时间',
  `last_access_time` date DEFAULT NULL COMMENT '最后访问时间',
  `ip` varchar(20) DEFAULT NULL,
  `state` tinyint(1) DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

/*Data for the table `sys_user` */

insert  into `sys_user`(`id`,`job_id`,`username`,`password`,`salt`,`name`,`sex`,`dept_id`,`dept`,`mobile`,`role_id`,`position`,`create_time`,`last_access_time`,`ip`,`state`) values (6,'SA12023001','admin','123',NULL,'系统管理员name',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(7,'SA12023002','a1','123',NULL,'终端部门负责人name',0,1,NULL,NULL,1,NULL,NULL,NULL,NULL,1),(8,'SA12023003','a2','123',NULL,'终端部门领导用户name',1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,1),(9,'SA12023004','a3','123',NULL,'终端部门涉密用户name',0,1,NULL,NULL,2,NULL,NULL,NULL,NULL,1),(10,'SA12023005','a4','123',NULL,'终端部门非涉密用户name',1,1,NULL,NULL,3,NULL,NULL,NULL,NULL,1),(11,'SA12023006','a5','123',NULL,'终端部门授权档案管理员name',0,1,NULL,NULL,4,NULL,NULL,NULL,NULL,1),(12,'SA12023007','a6','123',NULL,'终端部门涉密档案管理员name',1,1,NULL,NULL,5,NULL,NULL,NULL,NULL,1),(13,'SA12023008','a7','123',NULL,'终端部门非涉密档案管理员name',0,1,NULL,NULL,6,NULL,NULL,NULL,NULL,1),(14,'SA12023009','b1','123',NULL,'融合通信部门负责人name',1,2,NULL,NULL,1,NULL,NULL,NULL,NULL,1),(15,'SA12023010','b2','123',NULL,'融合通信部门领导用户name',0,2,NULL,NULL,1,NULL,NULL,NULL,NULL,1),(16,'SA12023011','b3','123',NULL,'融合通信部门涉密用户name',1,2,NULL,NULL,2,NULL,NULL,NULL,NULL,1),(17,'SA12023012','b4','123',NULL,'融合通信部门非涉密用户name',0,2,NULL,NULL,3,NULL,NULL,NULL,NULL,1),(18,'SA12023013','b5','123',NULL,'融合通信部门授权档案管理员name',1,2,NULL,NULL,4,NULL,NULL,NULL,NULL,1),(19,'SA12023014','b6','123',NULL,'融合通信部门涉密档案管理员name',0,2,NULL,NULL,5,NULL,NULL,NULL,NULL,1),(20,'SA12023015','b7','123',NULL,'融合通信部门非涉密档案管理员name',1,2,NULL,NULL,6,NULL,NULL,NULL,NULL,1),(21,'SA12023016','c1','123',NULL,'测试用户1',0,3,NULL,NULL,3,NULL,NULL,NULL,NULL,1),(22,'SA12023017','c2','123',NULL,'测试用户2',1,3,NULL,NULL,3,NULL,NULL,NULL,NULL,1),(23,'SA12023916','lhq','123',NULL,'李寒琦',1,3,NULL,'13800100001',2,NULL,'2016-07-09','2016-07-09','0:0:0:0:0:0:0:1',1),(24,'SA12023017','d1','123',NULL,'无线部门管理员',0,4,NULL,'13899797765',1,NULL,'2016-07-09','2016-07-09','0:0:0:0:0:0:0:1',1),(25,'SA12023918','d2','123',NULL,'无线部门授权档案管理员name',1,4,NULL,'13987665432',4,NULL,'2016-07-09','2016-07-09','0:0:0:0:0:0:0:1',1);

/*Table structure for table `sys_user_dept_role` */

DROP TABLE IF EXISTS `sys_user_dept_role`;

CREATE TABLE `sys_user_dept_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `dept_id` bigint(20) DEFAULT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `is_dept_manager` tinyint(1) DEFAULT '0' COMMENT '是否是部门管理员?0:否;1::是',
  `is_file_manager` tinyint(1) DEFAULT '0' COMMENT '是否是档案管理员?0:否;1::是',
  `state` tinyint(1) DEFAULT NULL COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

/*Data for the table `sys_user_dept_role` */

insert  into `sys_user_dept_role`(`id`,`user_id`,`dept_id`,`role_id`,`is_dept_manager`,`is_file_manager`,`state`) values (1,7,1,1,1,0,NULL),(2,8,1,1,0,0,NULL),(3,9,1,2,0,0,NULL),(4,10,1,3,0,0,NULL),(5,11,1,4,0,1,NULL),(6,12,1,5,0,1,NULL),(7,13,1,6,0,1,NULL),(8,14,2,1,1,0,NULL),(9,15,2,1,0,0,NULL),(10,16,2,2,0,0,NULL),(11,17,2,3,0,0,NULL),(12,18,2,4,0,1,NULL),(13,19,2,5,0,1,NULL),(14,20,2,6,0,1,NULL),(15,21,9,1,1,0,NULL),(16,22,9,4,0,1,NULL),(17,23,3,2,0,0,NULL),(18,24,4,1,1,0,NULL),(19,25,4,4,0,1,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
