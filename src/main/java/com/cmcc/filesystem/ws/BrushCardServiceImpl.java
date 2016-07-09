//package com.cmcc.filesystem.ws;
//
//import java.sql.Time;
//import java.text.DateFormat;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.GregorianCalendar;
//import java.util.List;
//import java.util.Locale;
//import java.util.ResourceBundle;
//
//import javax.jws.WebParam;
//import javax.jws.WebService;
//
//import org.apache.log4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import com.cmcc.xxt.constant.Constants;
//import com.cmcc.xxt.dao.AttencetimeMapper;
//import com.cmcc.xxt.dao.AttendanceRecordMapper;
//import com.cmcc.xxt.entity.Attencetime;
//import com.cmcc.xxt.entity.AttendanceRecord;
//import com.cmcc.xxt.util.SmsUtil;
//import com.cmcc.xxt.util.WeekdayUtil;
//
//@WebService(endpointInterface = "com.cmcc.xxt.ws.BrushCardService") 
//public class BrushCardServiceImpl implements BrushCardService { 
//	Logger logger=Logger.getLogger(this.getClass());
//	@Autowired
//	AttendanceRecordMapper attendanceRecordMapper;
//	
//	@Autowired
//	AttencetimeMapper attencetimeMapper;
//
//		@Override 
//		public String acceptBrushCard(@WebParam(name="content") String content) { 
//		SimpleDateFormat timeformat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		 DateFormat sdf = new SimpleDateFormat("hh:mm:ss");
//		ResourceBundle resb = ResourceBundle.getBundle("system", Locale.getDefault()); 
//		String syschlength="";
//		String devicecode="";
//		String purposecode="";
//		//确认
//		//String confirmlength="";
//		//功能号
//		String features="";
//		
//		//发送包号
//		String sendpackage="";
//		
//		//应答包号
//		//String answerpackage="";
//		
//		//包长度
//		String packagelength="";
//		
//		
//		//命令字
//		//String commandlength="";
//		
//		//校验和
//		String checkSum="";
//		
//		//返回内容
//		String resStr="";
//		try {
//			if(content==null||"".equals(content)){
//				return null;
//			}else{
//				 syschlength=content.substring(0,3);
//				 if(syschlength==null||!syschlength.equals(resb.getString("ODW"))){
//					 return null;
//				 }
//				 devicecode=content.substring(3,15);
//				 purposecode=content.substring(15,27);
//				//确认
//				// confirmlength=content.substring(27,28);
//				//功能号
//				 features=content.substring(28,30);
//				
//				//发送包号
//				 sendpackage=content.substring(30,34);
//				
//				//应答包号
//				// answerpackage=content.substring(34,38);
//				
//				//包长度
//				// packagelength=Integer.parseInt(content.substring(38,42),16);
//				 packagelength=content.substring(38,42);
//
////	    		if(packagelength!=null){
////	    			packagelength+=1;
////	    			packageLeg=String.valueOf(packagelength);
////	            	if(packageLeg.length()<2){
////	            		packageLeg="000"+packageLeg;
////	            	}else if(packageLeg.length()<3&&packageLeg.length()>1){
////	            		packageLeg="00"+packageLeg;
////	            	}else if(packageLeg.length()<4&&packageLeg.length()>2){
////	            		packageLeg="0"+packageLeg;
////	            	}
////	    		}
//				
//				
//				//命令字
//				 //commandlength=content.substring(42,44);
//				
//				//校验和
//				 checkSum=content.substring(content.length()-2,content.length());
//				
//				int attendanceIndex=Integer.parseInt(resb.getString("syschlength"))+Integer.parseInt(resb.getString("devicecode"))+
//				Integer.parseInt(resb.getString("purposecode"))+Integer.parseInt(resb.getString("confirmlength"))+
//				Integer.parseInt(resb.getString("features"))+Integer.parseInt(resb.getString("sendpackage"))+
//				Integer.parseInt(resb.getString("answerpackage"))+Integer.parseInt(resb.getString("packagelength"))+
//				Integer.parseInt(resb.getString("commandlength"));
//				//考勤总条数
//				int attendanceTotal=Integer.parseInt(content.substring(attendanceIndex,attendanceIndex+Integer.parseInt(resb.getString("attendancetotal"))),16);
//				String attdanceContent=content.substring(attendanceIndex+Integer.parseInt(resb.getString("attendancetotal")));
//				for(int i=0;i<attendanceTotal;i++){
//					String attence=attdanceContent.substring(21*i,21*(i+1));
//					//卡号
//					String cardCode=String.valueOf(Integer.parseInt(attence.substring(0,8),16));
//					String cardday=attence.substring(8,14);
//					String carddayAll=cardday.substring(0,2)+"-"+cardday.substring(2,4)+"-"+cardday.substring(4,6)+" 00:00:00";
//					String cardtime=attence.substring(14,20);
//					String cardtimeAll=cardtime.substring(0,2)+":"+cardtime.substring(2,4)+":"+cardtime.substring(4,6);
//					String status=attence.substring(20,21);
//					AttendanceRecord  record=new AttendanceRecord();
//					Time time=new Time(sdf.parse(cardtimeAll).getTime());
//					record.setStudentCard(cardCode);
//					record.setCreatetime(timeformat.parse(carddayAll));
//					record.setCardtime(time);
//					record.setType(Integer.parseInt(status));
//					attendanceRecordMapper.insertSelective(record);
//					//0表示进校，1表示离校
//					if("0".equals(status)){
//						Attencetime attenTime=new Attencetime();
//						//attenTime.setOthertime(sdf.parse(carddayAll));
//						//attenTime.setType(Constants.ATTENCETIME_OTHER);
//						attenTime.setAttendanceCard(cardCode);
//						List<Attencetime> list=attencetimeMapper.selectByAttendanceCard(attenTime);
//						if(list!=null&&list.size()>0){
//							Attencetime oneAttencetime=list.get(0);
//							if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//								//给家长发短信
//								SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("arriveSchool").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//							}
//							
//						}
//					}else{
//						Attencetime attenTime=new Attencetime();
//						attenTime.setOthertime(sdf.parse(carddayAll));
//						attenTime.setType(Constants.ATTENCETIME_OTHER);
//						attenTime.setAttendanceCard(cardCode);
//						List<Attencetime> list=attencetimeMapper.selectByAttendanceCard(attenTime);
//						//先判断是否有特殊设置
//						if(list!=null&&list.size()>0){
//							Attencetime oneAttencetime=list.get(0);
//							if(oneAttencetime.getLunchstart()!=null){
//								if((time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLunchstart().getTime())||
//										(time.getTime()>oneAttencetime.getLunchend().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime())){
//									//给家长发短信
//									SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//									//给老师发短信
//									SmsUtil.sendSms("", oneAttencetime.getMobile(), resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//								}else{
//									SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//								}
//								
//								
//							}else{
//								if((time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLunchstart().getTime())||
//										(time.getTime()>oneAttencetime.getLunchend().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime())){
//									//给家长发短信
//									SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//									//给老师发短信
//									SmsUtil.sendSms("", oneAttencetime.getMobile(), resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//								}else{
//									SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//								}
//								
//							}
//					     //判断是否工作日
//						}else{
//							GregorianCalendar se=new GregorianCalendar();
//					    	se.setTime(new Date());
//					        WeekdayUtil dateUtils = new WeekdayUtil();  
//					        boolean ok = dateUtils.isWeekday(se);
//					        //判断是否工作日
//					        if(ok){
//					        	Attencetime workattenTime=new Attencetime();
//					        	workattenTime.setType(Constants.ATTENCETIME_NOMAL);
//					        	workattenTime.setAttendanceCard(cardCode);
//								List<Attencetime> worklist=attencetimeMapper.selectByAttendanceCard(workattenTime);
//								//先判断是否有工作日设置
//								if(worklist!=null&&worklist.size()>0){
//									Attencetime oneAttencetime=worklist.get(0);
//									if(oneAttencetime.getLunchstart()!=null){
//										if((time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLunchstart().getTime())||
//												(time.getTime()>oneAttencetime.getLunchend().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime())){
//											//给家长发短信
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//											//给老师发短信
//											SmsUtil.sendSms("", oneAttencetime.getMobile(), resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//										}else{
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//										}
//										
//										
//									}else{
//										if((time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLunchstart().getTime())||
//												(time.getTime()>oneAttencetime.getLunchend().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime())){
//											//给家长发短信
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//											//给老师发短信
//											SmsUtil.sendSms("", oneAttencetime.getMobile(), resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//										}else{
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//										}
//										
//									}
//								}
//					        }else{
//					        	Attencetime workattenTime=new Attencetime();
//					        	workattenTime.setAttendanceCard(cardCode);
//								List<Attencetime> worklist=attencetimeMapper.selectByAttendanceCard(workattenTime);
//								if(worklist!=null&&worklist.size()>0){
//									Attencetime oneAttencetime=worklist.get(0);
//									SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##shi", cardtime.substring(0,2)).replace("##fen", cardtime.substring(2,4)));
//								}
//					        	
//					        }
//							
//						}
//					}
//
//					
//				}
//				
//				 resStr=resb.getString("returnsyschCode")+purposecode+devicecode+"0"+features+"0001"+sendpackage+packagelength+resb.getString("cardservicesuccess")+checkSum;
//				return resStr;
//				
//			}
//		} catch (Exception e) {
//			logger.error(e.getMessage());
//			 resStr=resb.getString("returnsyschCode")+purposecode+devicecode+"0"+features+"0001"+sendpackage+packagelength+resb.getString("cardserviceerror")+checkSum;
//			return resStr;
//		}
//			
//		
//	} 
//
//
//}