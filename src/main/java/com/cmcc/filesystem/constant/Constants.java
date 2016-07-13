package com.cmcc.filesystem.constant;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 基础常量类
 * @author 
 *
 */
public class Constants {
	
	//部门负责人的roleId
	public static final Long DEPT_MANAGER_ROLEID = 1l;

	//授权档案管理员
	public static final Long PRIVILEDGE_MANAGER_ROLEID = 4l;
	
	//发文类型generate_type
	public static final String GENERATE_TYPES = "上级,平级,下级";
	
	//等级（特提、特急、加急、平级）
	public static final String EMERGENCY_LEVEL = "特急,特急,加急,平急";
	
	//密级（绝密、机密、秘密、内部、普通）
    public static final String SECRET_LEVEL = "绝密,机密,秘密,内部,普通";
    //密级与role_type的对应值
    public static final Map<String, String> SECRET_LEVEL_RESOURCE_ID = new HashMap<String, String>();
    static {
        SECRET_LEVEL_RESOURCE_ID.put("绝密", "1");
        SECRET_LEVEL_RESOURCE_ID.put("机密", "2");
        SECRET_LEVEL_RESOURCE_ID.put("秘密", "3");
        SECRET_LEVEL_RESOURCE_ID.put("内部", "4");
        SECRET_LEVEL_RESOURCE_ID.put("普通", "5");
    }
    //密级与role_type的对应值
    public static final Map<String, String> SECRET_LEVEL_FILEMANAGER_LEVEL = new HashMap<String, String>();
    static {
    	SECRET_LEVEL_FILEMANAGER_LEVEL.put("绝密", "一级");
    	SECRET_LEVEL_FILEMANAGER_LEVEL.put("机密", "二级");
    	SECRET_LEVEL_FILEMANAGER_LEVEL.put("秘密", "二级");
    	SECRET_LEVEL_FILEMANAGER_LEVEL.put("内部", "三级");
    	SECRET_LEVEL_FILEMANAGER_LEVEL.put("普通", "三级");
    }
	
    //所有的角色id
    public static final String ROLEID1 = "1";
    public static final String ROLEID2 = "2";
    public static final String ROLEID3 = "3";
    public static final String ROLEID4 = "4";
    public static final String ROLEID5 = "5";
    public static final String ROLEID6 = "6";
    public static final String ROLEID7 = "7";
    
    //角色可以拥有的所有权限
    public static final Map<String, String> ROLE_RESOURCEIDS = new HashMap<String, String>();
    static {
//        ROLE_RESOURCEIDS.put(ROLEID1, "11,21,31,32,41,42,12,22,32,42,1,2");
//        ROLE_RESOURCEIDS.put(ROLEID2, "21,22,31,32,41,42,11,12,21,22,31,32,41,42");
//        ROLE_RESOURCEIDS.put(ROLEID3, "31,32,41,42,31,32,41,42");
//        ROLE_RESOURCEIDS.put(ROLEID4, "11,12,13,14,15,16,17,18,21,22,23,24,25,26,27,28,31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48,1,2");
//        ROLE_RESOURCEIDS.put(ROLEID5, "13,15,17,21,22,23,25,27,31,32,33,35,37,41,42,43,45,47,11,12,21,22,31,32,41,42,15,16,25,26,35,36,45,46,17,18,27,28,37,38,47,48");
//        ROLE_RESOURCEIDS.put(ROLEID6, "31,32,33,35,37,41,42,43,45,47,31,32,41,42,35,36,45,46,37,38,47,48");

        ROLE_RESOURCEIDS.put(ROLEID1, "21,31,41,42,51,52,2,202,203,7,710,720,8,810,22,32,42,52,11,12");
        ROLE_RESOURCEIDS.put(ROLEID2, "31,32,41,42,51,52,2,202,203,7,710,720,8,810,21,22,31,32,41,42,51,52");
        ROLE_RESOURCEIDS.put(ROLEID3, "41,42,51,52,2,202,203,7,710,720,8,810");
        ROLE_RESOURCEIDS.put(ROLEID4, "21,23,24,25,26,27,28,31,33,34,35,36,37,38,41,42,43,44,45,46,47,48,51,52,53,54,55,56,57,58,2,202,203,11,12");
        ROLE_RESOURCEIDS.put(ROLEID5, "23,25,27,31,32,33,35,37,41,42,43,45,47,51,52,53,55,57,2,202,203,7,710,720,6,610,611,612,613,614,620,21,22,31,32,41,42,51,52,35,36,45,46,55,56,27,28,37,38,47,48,57,58");
        ROLE_RESOURCEIDS.put(ROLEID6, "41,42,43,45,47,51,52,53,55,57,2,202,203,7,710,720,6,610,611,612,613,614,620,630,7,710,720,730,8,810,43,44,45,46,47,48,53,54,55,56,57,58");
        ROLE_RESOURCEIDS.put(ROLEID7, "3,4,5,6,7,8,11,12,13,14,15,16,17,18,21,22,23,24,25,26,27,28,31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48,51,52,53,54,55,56,57,58,2,202,203,7,710,720,6,610,611,612,613,614,620,630,7,710,720,730,8,810,820,830,840");
    }
	
    //"接受档案"的状态码
    public static final Long RECEIVE_AUDIT_ID = 0l;		//用sys_file表中的audit_id字段来表示该文件是否被接收审核过？0：表示未被审核
    
    //"接收档案"审核结果状态码
    public static final String RECEIVE_AUDIT_RESULT1 = "1";		//1:审核通过
    public static final String RECEIVE_AUDIT_RESULT0 = "0";		//0:审核不通过
	
    //上传的档案的存储地址
    public static final String FILE_PATH = "Q:\\upload";
    
    //menu和button
    public static final String MENU = "menu";
    public static final String BUTTON = "button";
    
    
    
    
    
	
	
	
    public static final String CURRENT_USER = "user";
    
    public static final int HYADMIN = 0;
    public static final int PROVINCEADMIN = 1;
    public static final int CITYADMIN = 2;
    public static final int FIRSTANGET = 3;
    public static final int SECONDANGET = 4;
    
    public static final int TEACHER = 8;            //任课老师
    public static final int SCHOOLADMIN = 9;       //学校管理员 。学校管理员存储在sys_person表中
    
    //填写在sys_teacher表中的role_ids字段中，用于表示该教师具体是什么职务。sys_middle表中的position_id字段填的是sys_role表中的id
    public static final int SCHOOLMASTERROLE = 14;   //校长
    public static final int VICESCHOOLMASTERROLE = 15;   //副校长
    public static final int DEANROLE = 16;   //教导主任
    public static final int AOSROLE = 17;   //政务主任
    public static final int GENERALROLE = 18;   //总务主任
    //下面三个职务要跟年纪挂钩
    public static final int GRADELEADERROLE = 19;   //年级组长
    
    public static final int SCHOOLADMINROLE = 20;   //学校管理员角色
    public static final int HEADTEACHERROLE = 21;   //班主任角色
    public static final int TEACHERROLE = 22;   //任课老师角色
    
    public static final int NOPOSITIONROLE = 23;//没有职务的角色
    public static final int STUDENTTYPE = 16;
    
    //幼儿园中四个班级名称
    public static final String KINDERGARDENCLASS1 = "小小班";
    public static final String KINDERGARDENCLASS2 = "小班";
    public static final String KINDERGARDENCLASS3 = "中班";    
    public static final String KINDERGARDENCLASS4 = "大班"; 
    //幼儿园的名字
    public static final String KINDERGARDEN = "幼儿园"; 
    //非幼儿园的名字
    public static final String UNKINDERGARDEN = "非幼儿园"; 
    
    //班主任/任课老师（不分开）>校长>副校长>教导主任>政务主任>总务主任   的优先级。
    public static final String[] ROLESEQUENCE = new String[] {"任课老师", "班主任", "校长", "副校长", "教导主任", "政务主任", "总务主任"};

    
    /*
     * 手机号码长度
     */
    public static final int MOBILE_LENGTH = 11;
    
    /*
     * 允许输入错误密码的次数，超过该次数，用户将被锁住
     */
    public static final int LOCK_COUNT = 10;
    
    public static final String FILE_HOMEWORK_PATH = "/edu/homeworkfile/";
    public static final String FILE_NOTICE_PATH = "/edu/noticefile/";
    public static final String FILE_CLASSRING_PATH = "/edu/file/";
    public static final String FILE_PORTRAIT_PATH = "/edu/portrait/";
    public static final String FILE_TEACHER_PATH = "/uploadTeacherfile/";
    public static final String FILE_SCHOOLADMIN_PATH = "/uploadSchoolAdminfile/";
    public static final String FILE_PARENT_PATH = "/uploadParentfile/";
    public static final String FILE_NOTICE_PATH_TEMP = "/uploadnotice/";
    public static final String FILE_REDLIST_PATH_TEMP = "/uploadredlist/";
    public static final String FILE_ASSESSMENT_PATH_TEMP = "/uploadAssessment/";
    public static final String JWT_TOKEN = "token";
    public static final String JWT_PARAM = "param";
    public static final String JWT_BIZ = "biz";
	//jwt token 校验
    public static final String TOKEN_USER_STR = "user";
    public static final String TOKEN_SUBJECT_STR = "subject";
    public static final String TOKEN_STR="code";
    public static final String TOKEN_SUCCESS_CODE="200";
    public static final String TOKEN_EXPIRE_CODE="1001";
    public static final String TOKEN_ILLEAGAL_CODE="1002";
	
    public static final Integer INACTIVE_STATUS = 100;
    public static final Integer NO_CLASS_STATUS = 101;
    public static final Integer EXPIRED_STATUS = 102;
    public static final Integer SUCCESS_STATUS = 200;
    public static final Integer EXCEPTION_STATUS = 600;
    public static final Integer EMPTY_STATUS = 500;
    public static final Integer NO_USER_STATUS = 300;
    public static final Integer HAS_USER_STATUS = 301;
    public static final Integer IMPERFECT_STATUS = 302;
    public static final Integer USERAPPLYING_STATUS = 303;
    public static final Integer NOPASSAPPLY_STATUS = 304;
    public static final Integer IM_FAIL_STATUS = 305;
    public static final Integer MISS_FILE_STATUS = 306;
    public static final Integer UPDATE_FAIL_STATUS = 307;
    public static final Integer ERROR_PASSWORD_STATUS = 400;
    public static final Integer ERROR_INVITECODE_STATUS = 401;
    public static final Integer DELETE_FAIL_STATUS = 402;
    public static final Integer LOCKED_STATUS = 403;
    public static final Integer MISS_PARAMETERS_STATUS = 700;
    public static final Integer ERROR_PARAMETER_STATUS = 800;

    
    
    public static final String AUDIT_PASS = "1";
    public static final String AUDIT_FAIL = "0";
    public static final String AUDIT_CONFIRM = "2";
    
    public static final String AGENT_STATUS_USE = "1";
    public static final String AGENT_STATUS_STOP = "0";
    public static final String AGENT_STATUS_CONFIRM = "2";
    public static final String AGENT_STATUS_NOUSE = "-1";
    

    public static final String SCHOOL_NOTICE = "0";
    public static final String CLASS_NOTICE = "1";
    
    public static final String ATTENCETIME_NOMAL = "0";
    
    public static final String ATTENCETIME_OTHER = "1";
    
    public static final int LIMITED_POINTS = 980;
    
    public static final String 	POINTS_WILDCARD = "@@";
    
    public static final String 	ACTIVITY_WILDCARD = "##";
    
    public static final String 	STATISTICS_WILDCARD = "__";
    
    public static final String INTF_WILDCARD = "$$EDUCLOUD$$";
    
    public static  Map<String, Integer> map = new HashMap<String, Integer>();
    
	private static Map<String, String> cDevice = new ConcurrentHashMap<String,String>();
	
	/**
	 * 获取cDevice
	 * @return
	 */
	public static Map<String, String> getcDevice() {
		return cDevice;
	}
	/**
	 * 设置cDevice
	 * @param cDevice
	 */
	public static void setcDevice(Map<String, String> cDevice) {
		Constants.cDevice = cDevice;
	}
	/**
	 * 获取状态
	 * @return
	 */
	public static Map<String, Long> getStatus() {
		return status;
	}
	/**
	 * 设置状态
	 * @param status
	 */
	public static void setStatus(Map<String, Long> status) {
		Constants.status = status;
	}
	private static Map<String, Long> status = new ConcurrentHashMap<String,Long>();
    
//    public static final String[] STATISTICS_PROVINCE = {"青海"};
//    
//    public static final String[] STATISTICS_ITEM = {"地市名称","代理商名称","学校"};
//    
//    public static final String[] STATISTICS_DETAIL={"已有学校数量","当月新增学校数量","当月新增学校数量",
//    												"每月减少的付费用户数量","退订的用户数量","每日活跃用户量",
//    												"聊天功能的使用人数","公告功能的使用人数","考勤功能的使用人数",
//    												"作业功能的使用人数","考试功能的使用人数","课程表功能的使用人数",
//    												"请假条功能的使用人数","学生评估功能的使用人数","班级圈功能的使用人数",
//    												"每月家长兑换积分总计","每月教师兑换积分总计"};
//    
//    public static final String[] STATISTICS_SCHOOL={"幼儿园","小学","初中","高中"};
//    		
//    public static final String[] STATISTICS_USER={"教师","家长"};
    
    public static List<String> STATISTICS_PROVINCE = new ArrayList<String>();
    
    public static List<String> STATISTICS_UPLEVEL = new ArrayList<String>();
    
    public static  List<String> STATISTICS_ITEM = new ArrayList<String>();
    
    public static  List<String> STATISTICS_DETAIL = new ArrayList<String>();
    
    public static  List<String> STATISTICS_TPYE = new ArrayList<String>();
    
    public static  List<String> STATISTICS_SCHOOL = new ArrayList<String>();
    
    public static  List<String> STATISTICS_USER = new ArrayList<String>();
    
    public static Map<String, String> STATISTICS = new HashMap<String,String>();
    
    public static Map<String, String> STATISTICS_COUNT = new HashMap<String,String>();
    
    public static final	int PROVINCE_CODE = 630000;
    
    private static String clientId;

    public static String getClientId() {
        return clientId;
    }
    public static void setClientId(String clientId) {
        Constants.clientId = clientId;
    }
    
    static{
    	
    	STATISTICS_UPLEVEL.add("学校及用户量");
    	STATISTICS_UPLEVEL.add("功能使用情况");
    	STATISTICS_UPLEVEL.add("积分兑换情况");
    	
    	STATISTICS_PROVINCE.add("青海省");
    	STATISTICS_ITEM.add("地区名称");
    	STATISTICS_ITEM.add("代理商名称");
    	STATISTICS_ITEM.add("学校");
    	
    	STATISTICS_TPYE.add("按省份显示");
    	STATISTICS_TPYE.add("按地市显示");
    	STATISTICS_TPYE.add("按代理商显示");
    	STATISTICS_TPYE.add("按学校显示");
    	
    	STATISTICS_DETAIL.add("已有学校数量");
    	STATISTICS_DETAIL.add("新增学校数量");
    	STATISTICS_DETAIL.add("当月新增的付费用户");
    	STATISTICS_DETAIL.add("每月减少的付费用户数量");
    	STATISTICS_DETAIL.add("退订的用户数量");
    	STATISTICS_DETAIL.add("每月活跃用户量");
    	STATISTICS_DETAIL.add("聊天功能的使用人数");
    	STATISTICS_DETAIL.add("公告功能的使用人数");
    	STATISTICS_DETAIL.add("考勤功能的使用人数");
    	STATISTICS_DETAIL.add("作业功能的使用人数");
    	STATISTICS_DETAIL.add("考试功能的使用人数");
    	STATISTICS_DETAIL.add("课程表功能的使用人数");
    	STATISTICS_DETAIL.add("请假条功能的使用人数");
    	STATISTICS_DETAIL.add("学生评估功能的使用人数");
    	STATISTICS_DETAIL.add("班级圈功能的使用人数");
    	STATISTICS_DETAIL.add("每月兑换积分总计");
    	STATISTICS_DETAIL.add("每月兑换人次总计");
    	STATISTICS_DETAIL.add("用户数量");
    	STATISTICS_SCHOOL.add("幼儿园");
    	STATISTICS_SCHOOL.add("6年制小学");
    	STATISTICS_SCHOOL.add("初级中学(3年)");
    	STATISTICS_SCHOOL.add("完全中学(3+3)");
    	STATISTICS_USER.add("老师");
    	STATISTICS_USER.add("家长");
    	
    }
    
    public static final String ATTENDANCE_SUCCESS = "0";
    public static final String ATTENDANCE_OTHER_ERROR = "99";
    public static final String ATTENDANCE_PASSWORD_ERROR = "10";
    public static final String ATTENDANCE_TIMESTAMP_ERROR = "11";
    public static final String ATTENDANCE_SUCCESSNO_ALL_ERROR = "13";
    public static final String ATTENDANCE_SUCCESSNO_PART_ERROR = "12";
    public static final String ATTENDANCE_TARGETSPACE = "http://ws.xxt.cmcc.com/";
    public static final String INTFBOSS_TARGETSPACE = "http://ws.xxt.cmcc.com/";
    
    
    public static final String LAST_SEMESTER_STARTTIME = "08-15";
    public static final String LAST_SEMESTER_ENDTIME = "02-14";
    public static final String NEXT_SEMESTER_STARTTIME = "02-15";
    public static final String NEXT_SEMESTER_ENDTIME = "08-14";
    
    public static final Map<String, String> SCHOOL_TYPE = new HashMap<String, String>();
    static {
        SCHOOL_TYPE.put("幼儿园", "/0");
        SCHOOL_TYPE.put("6年制小学", "/6");
        SCHOOL_TYPE.put("5年制小学", "/5");
        SCHOOL_TYPE.put("幼儿园+小学", "/6");

        SCHOOL_TYPE.put("初级中学(3年)", "/9");      //七年级、八年级、九年级
        SCHOOL_TYPE.put("初级中学(4年)", "/9");      //六年级、七年级、八年级、九年级
        SCHOOL_TYPE.put("高级中学(3年)", "/12");
        SCHOOL_TYPE.put("完全中学(3+3)", "/12");      //七年级、八年级、九年级、高一、高二、高三
        SCHOOL_TYPE.put("完全中学(4+3)", "/12");      //六年级、七年级、八年级、九年级、高一、高二、高三
        SCHOOL_TYPE.put("一贯制学校(6+3)", "/9");
        SCHOOL_TYPE.put("一贯制学校(5+4)", "/9");
        SCHOOL_TYPE.put("全年级学校(6+3+3)", "/12");
        SCHOOL_TYPE.put("12年级学校", "/12");
    }
    
    public static final Map<String, String> GRADE_TYPE = new HashMap<String, String>();
    static {
        GRADE_TYPE.put("小小班", "-3");
        GRADE_TYPE.put("小班", "-2");
        GRADE_TYPE.put("中班", "-1");
        GRADE_TYPE.put("大班", "0");
        
        GRADE_TYPE.put("一年级", "1");
        GRADE_TYPE.put("二年级", "2");
        GRADE_TYPE.put("三年级", "3");
        GRADE_TYPE.put("四年级", "4");
        GRADE_TYPE.put("五年级", "5");
        GRADE_TYPE.put("六年级", "6");
        
        GRADE_TYPE.put("七年级", "7");
        GRADE_TYPE.put("八年级", "8");
        GRADE_TYPE.put("九年级", "9");
        
        GRADE_TYPE.put("高一", "10");
        GRADE_TYPE.put("高二", "11");
        GRADE_TYPE.put("高三", "12");
    }
}
