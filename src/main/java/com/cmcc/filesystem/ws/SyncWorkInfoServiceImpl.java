//package com.cmcc.filesystem.ws;
//
//import java.net.URLEncoder;
//import java.sql.Time;
//import java.text.DateFormat;
//import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.GregorianCalendar;
//import java.util.List;
//import java.util.Locale;
//import java.util.ResourceBundle;
//import java.util.UUID;
//
//import javax.jws.WebService;
//import javax.xml.ws.BindingType;
//
//import org.apache.log4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//
//
////@BindingType(value=SOAPBinding.SOAP12HTTP_BINDING)
//@BindingType(value = "http://www.w3.org/2003/05/soap/bindings/HTTP/")
//@WebService(endpointInterface = "com.cmcc.xxt.ws.SyncWorkInfoService",targetNamespace=Constants.ATTENDANCE_TARGETSPACE)
//
//public class SyncWorkInfoServiceImpl implements SyncWorkInfoService{
//	protected Logger logger = Logger.getLogger(getClass());
//	
//	
//	
//	@Override
//	public WsResultInfo GetServerTime(){
//		
//		Date date= new Date();
//		Date date1=DateUtil.parseToDateOther("19700101000000");
//		long interval = (date.getTime() - date1.getTime())/1000;
//			WsResultInfo ws = new WsResultInfo();
//			ws.setResultCode("0");
//			ws.setResultMessage("成功");
//			ws.setSuccessNo((DateUtil.DateToStringOther(date)+","+interval));
//			ws.setUsedSecond("0");
//			return ws;
//	}
//	
//	@Override
//	public WsResultInfo SyncWorkInfo(String timeStamp,String hashedPwd,EventInfo eventlist,String streamingNo,
//		String spId,String schoolNo) {
//		// TODO Auto-generated method stub
//		String successNo="";
//		String resultCode=Constants.ATTENDANCE_SUCCESS;
//		int total=0;
//		String resultMessage="成功";
//		
//		ResourceBundle resb = ResourceBundle.getBundle("system", Locale.getDefault()); 
//		DateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
//		try {
//			   logger.info("进入考勤");
//			   logger.info("timeStamp:"+timeStamp+"--hashedPwd:"+hashedPwd+"--streamingNo:"+streamingNo+"--spId:"+spId+"--schoolNo:"+schoolNo);
//			  Date timeStampdate=DateUtil.parseToDateOther(timeStamp);
//			  Date newDate= new Date();
//			  if(Math.abs(newDate.getTime()-timeStampdate.getTime())>2*60*1000){
//				  resultCode=Constants.ATTENDANCE_TIMESTAMP_ERROR;
//				  resultMessage="时间失效";
//				  logger.error("时间失效");
//				  WsResultInfo ws = new WsResultInfo();
//				  ws.setStreamingNo(streamingNo);
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  ws.setSuccessNo(successNo);
//				  return ws;
//			  }
//			  String checkpwd=spId+streamingNo+schoolNo+
//					  timeStamp+Config.getString("interfacePwd");
//			  if(hashedPwd != null && hashedPwd.equalsIgnoreCase(DES.getMD5(checkpwd))){
//				  logger.info("MD5密码匹配");
//			  }else{
//				  resultCode=Constants.ATTENDANCE_PASSWORD_ERROR;
//				  resultMessage="MD5密码不对";
//				  logger.error("MD5密码不对");
//				  WsResultInfo ws = new WsResultInfo();
//				  ws.setStreamingNo(streamingNo);
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  ws.setSuccessNo(successNo);
//				  return ws;
//			  }
//			  logger.info("解析eventlist");
//			  boolean deviceExist=true;
//			  if(eventlist!=null&&eventlist.getEventlist().size()>0){
//				  total=eventlist.getEventlist().size();
//				  logger.info("刷卡数目"+total);
//				  for(EventInfo el:eventlist.getEventlist()){
//						//卡号
//						String cardCode=el.getUserNo();
//						//时间
//						String cardday=el.getOccurTime();
//						String carddayAll=cardday.substring(0,4)+"-"+cardday.substring(4,6)+"-"+cardday.substring(6,8)+" 00:00:00";
//						String hour=cardday.substring(8,10);
//						String minute=cardday.substring(10,12);
//						String secode=cardday.substring(12,14);
//						String cardtimeAll=hour+":"+minute+":"+secode;
//						//进出校状态
//						String status=el.getStateFlag().toString();
//						//考勤机代码
//						String machineNo=el.getMachineNo();
//						logger.info("卡号:"+cardCode+"刷卡时间:"+cardtimeAll);
//						
//						
//						//判断考勤机代码是否有效
//						if(deviceExist){
//							DeviceSchool device= new DeviceSchool();
//							device.setDeviceCode(machineNo);
//							device.setFactoryId(1l);
//							
//							List<DeviceSchool> devicelist=deviceSchoolService.selectByDeviceCode(device);
//							if(devicelist==null||devicelist.size()==0){
//								logger.info("the device  doesn't existed or the device has not been passed"+machineNo);
//								resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//								resultMessage="考勤设备号无效";
//								WsResultInfo ws = new WsResultInfo();
//								  ws.setStreamingNo(streamingNo);
//								  ws.setResultCode(resultCode);
//								  ws.setResultMessage(resultMessage);
//								  ws.setSuccessNo(successNo);
//								  return ws;
//							}else{
//								logger.info("更新心跳时间!");
//								//更新设备心跳时间
//								DeviceSchool ds=new DeviceSchool();
//								ds.setId(devicelist.get(0).getId());
//								ds.setHeartTime(new Date());
//								ds.setState(1);
//								deviceSchoolService.updateByHeartTime(ds);
//								deviceExist=false;
//							}
//						}
//						
//						
//						Student stu=new Student();
//						stu.setAttendanceCard(cardCode);
//						stu.setDeviceCode(machineNo);
//						List<Student> l=studentMapper.findByAttendanceCard(stu);
//						
//						//判断卡号是否有效
//						if(l==null||l.size()==0){
//							logger.info("the user of the card doesn't existed or the user has not been passed"+cardCode);
//							continue;
//						}
//						logger.info("status:"+status);
//						AttendanceRecord  record=new AttendanceRecord();
//						Time time=new Time(timeFormat.parse(cardtimeAll).getTime());
//						//if(!"99".equals(status)){
//							record.setStudentCard(cardCode);
//							record.setCreatetime(DateUtil.parseDate(carddayAll));
//							record.setDevicecode(machineNo);
//							record.setCardtime(time);
//							record.setType(Integer.parseInt(status));
//							attendanceRecordMapper.insertSelective(record);
//							logger.info("插入数据");
//						//}
//						
//						successNo+=cardCode+",";
//						
//						//获取班主任手机号码
//						String teacherMobile="";
//						String msgContent="";
//						List<Attencetime> teacherList=attencetimeMapper.selectTeacherMobileCard(cardCode);
//						//0表示进校，1表示离校
//						if("0".equals(status)){
//							Attencetime attenTime=new Attencetime();
//							attenTime.setAttendanceCard(cardCode);
//							attenTime.setIsfee(true);
//							List<Attencetime> list=attencetimeMapper.selectByAttendanceCard(attenTime);
//							if(list!=null&&list.size()>0){
//								Attencetime oneAttencetime=list.get(0);
//								if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//									//给老师发短信
//									logger.info("开始发送短信");
//									//给家长发短信
//									SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("arriveSchool").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//									logger.info("给家长发送短信成功.手机号:"+oneAttencetime.getParentmoblie());
//								}
//								
//							}
//						}else if("1".equals(status)){
//							Attencetime attenTime=new Attencetime();
//							attenTime.setOthertime(DateUtil.parseDate(carddayAll));
//							attenTime.setType(Constants.ATTENCETIME_OTHER);
//							attenTime.setAttendanceCard(cardCode);
//							attenTime.setIsfee(true);
//							List<Attencetime> list=attencetimeMapper.selectByAttendanceCard(attenTime);
//							//先判断是否有特殊设置
//							if(list!=null&&list.size()>0){
//								Attencetime oneAttencetime=list.get(0);
//								if(oneAttencetime.getLunchstart()!=null){
//									if((time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLunchstart().getTime())||
//											(time.getTime()>oneAttencetime.getLunchend().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime())){
//										if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//											//给老师发短信
//											logger.info("开始发送短信");
//											//给家长发短信
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//											logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//										}
//										String leaveSchoolTeacher=resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute);
//										if(teacherList!=null&&teacherList.size()>0){
//											for(Attencetime att:teacherList){
//												if(att.getMobile()!=null&&!"".equals(att.getMobile())){
//													teacherMobile+=att.getMobile()+",";
//													msgContent+=URLEncoder.encode(leaveSchoolTeacher, "utf8")+",";
//												}
//											}
//											teacherMobile = teacherMobile.substring(0,teacherMobile.length()-1);
//											msgContent = msgContent.substring(0,msgContent.length()-1);
//											
//										}
//										if(!"".equals(teacherMobile)){
//											//给老师发短信
//											logger.info("开始发送短信");
//											SmsUtil.sendAttendance(msgContent, teacherMobile);
//											logger.info("给老师发送短信成功"+cardtimeAll+"手机号:"+teacherMobile);
//										}
//										
//										
//									}else{
//										if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//											logger.info("开始发送短信");
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//											logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//										}
//										
//									}
//									
//									
//								}else{
//									if(oneAttencetime.getArrivetime()!=null&&time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime()){
//										if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//											logger.info("开始发送短信");
//											//给家长发短信
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//											logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//										}
//										
//										String leaveSchoolTeacher=resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute);
//										if(teacherList!=null&&teacherList.size()>0){
//											for(Attencetime att:teacherList){
//												if(att.getMobile()!=null&&!"".equals(att.getMobile())){
//													teacherMobile+=att.getMobile()+",";
//													msgContent+=URLEncoder.encode(leaveSchoolTeacher, "utf8")+",";
//												}
//											}
//											teacherMobile = teacherMobile.substring(0,teacherMobile.length()-1);
//											msgContent = msgContent.substring(0,msgContent.length()-1);
//											
//										}
//										if(!"".equals(teacherMobile)){
//											//给老师发短信
//											logger.info("开始发送短信");
//											SmsUtil.sendAttendance(msgContent, teacherMobile);
//											logger.info("给老师发送短信成功"+cardtimeAll+"手机号:"+teacherMobile);
//										}
//									}else{
//										if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//											logger.info("开始发送短信");
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//											logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//										}
//										
//									}
//									
//								}
//						     //判断是否工作日
//							}else{
//								GregorianCalendar se=new GregorianCalendar();
//						    	se.setTime(new Date());
//						        WeekdayUtil dateUtils = new WeekdayUtil();  
//						        boolean ok = dateUtils.isWeekday(se);
//						        //判断是否工作日
//						        if(ok){
//						        	Attencetime workattenTime=new Attencetime();
//						        	workattenTime.setType(Constants.ATTENCETIME_NOMAL);
//						        	workattenTime.setAttendanceCard(cardCode);
//						        	workattenTime.setIsfee(true);
//									List<Attencetime> worklist=attencetimeMapper.selectByAttendanceCard(workattenTime);
//									//先判断是否有工作日设置
//									if(worklist!=null&&worklist.size()>0){
//										Attencetime oneAttencetime=worklist.get(0);
//										if(oneAttencetime.getLunchstart()!=null){
//											if((time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLunchstart().getTime())||
//													(time.getTime()>oneAttencetime.getLunchend().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime())){
//												if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//													logger.info("开始发送短信");
//													//给家长发短信
//													SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//													logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//												}
//												
//												String leaveSchoolTeacher=resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute);
//												if(teacherList!=null&&teacherList.size()>0){
//													for(Attencetime att:teacherList){
//														if(att.getMobile()!=null&&!"".equals(att.getMobile())){
//															teacherMobile+=att.getMobile()+",";
//															msgContent+=URLEncoder.encode(leaveSchoolTeacher, "utf8")+",";
//														}
//													}
//													teacherMobile = teacherMobile.substring(0,teacherMobile.length()-1);
//													msgContent = msgContent.substring(0,msgContent.length()-1);
//													
//												}
//												if(!"".equals(teacherMobile)){
//													//给老师发短信
//													logger.info("开始发送短信");
//													SmsUtil.sendAttendance(msgContent, teacherMobile);
//													logger.info("给老师发送短信成功"+cardtimeAll+"手机号:"+teacherMobile);
//												}
//											}else{
//												if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//													logger.info("开始发送短信");
//													SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//													logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//												}
//												
//											}
//											
//											
//										}else{
//											if(oneAttencetime.getArrivetime()!=null&&time.getTime()>oneAttencetime.getArrivetime().getTime()&&time.getTime()<oneAttencetime.getLeavetime().getTime()){
//												if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//													logger.info("开始发送短信");
//													//给家长发短信
//													SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchoolParent").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//													logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//												}
//												
//												String leaveSchoolTeacher=resb.getString("leaveSchoolTeacher").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute);
//												if(teacherList!=null&&teacherList.size()>0){
//													for(Attencetime att:teacherList){
//														if(att.getMobile()!=null&&!"".equals(att.getMobile())){
//															teacherMobile+=att.getMobile()+",";
//															msgContent+=URLEncoder.encode(leaveSchoolTeacher, "utf8")+",";
//														}
//													}
//													teacherMobile = teacherMobile.substring(0,teacherMobile.length()-1);
//													msgContent = msgContent.substring(0,msgContent.length()-1);
//													
//												}
//												if(!"".equals(teacherMobile)){
//													//给老师发短信
//													logger.info("开始发送短信");
//													SmsUtil.sendAttendance(msgContent, teacherMobile);
//													logger.info("给老师发送短信成功"+cardtimeAll+"手机号:"+teacherMobile);
//												}
//											}else{
//												if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//													logger.info("开始发送短信");
//													SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//													logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//												}
//												
//											}
//											
//										}
//									}else{
//			                        	Attencetime leaveworkattenTime = new Attencetime();
//			                        	leaveworkattenTime.setAttendanceCard(cardCode);
//			                        	leaveworkattenTime.setIsfee(true);
//			                            List<Attencetime> leaveworklist = attencetimeMapper
//			                                    .selectByAttendanceCard(leaveworkattenTime);
//			                            if (leaveworklist != null && leaveworklist.size() > 0) {
//			                                logger.info("获取家长信息" + leaveworklist.size());
//			                            }
//			                            if (leaveworklist != null && leaveworklist.size() > 0) {
//			                                Attencetime oneAttencetime = leaveworklist.get(0);
//			                                if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//			                                	logger.info("开始发送短信");
//			                                    String paraentsContent = resb.getString("leaveSchool")
//			                                            .replace("##stu", oneAttencetime.getStuName())
//			                                            .replace("##shi", hour).replace("##fen", minute);
//			                                    SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), paraentsContent);
//			                                    logger.info("给家长发送短信成功" + cardtimeAll + oneAttencetime.getParentmoblie()
//			                                            + ".短信内容:" + paraentsContent);
//			                                }
//			                                
//			                            }
//			                        
//			                        }
//						        }else{
//						        	Attencetime workattenTime=new Attencetime();
//						        	workattenTime.setAttendanceCard(cardCode);
//						        	workattenTime.setIsfee(true);
//									List<Attencetime> worklist=attencetimeMapper.selectByAttendanceCard(workattenTime);
//									if(worklist!=null&&worklist.size()>0){
//										Attencetime oneAttencetime=worklist.get(0);
//										if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//											logger.info("开始发送短信");
//											SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("leaveSchool").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//											logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//										}
//										
//									}
//						        	
//						        }
//								
//							}
//						}else if("99".equals(status)){
//							Attencetime workattenTime=new Attencetime();
//				        	workattenTime.setAttendanceCard(cardCode);
//				        	workattenTime.setIsfee(true);
//							List<Attencetime> worklist=attencetimeMapper.selectByAttendanceCard(workattenTime);
//							if(worklist!=null&&worklist.size()>0){
//								Attencetime oneAttencetime=worklist.get(0);
//								if(oneAttencetime.getParentmoblie()!=null&&!"".equals(oneAttencetime.getParentmoblie())){
//									logger.info("开始发送短信");
//									SmsUtil.sendSms("", oneAttencetime.getParentmoblie(), resb.getString("studentCheck").replace("##stu", oneAttencetime.getStuName()).replace("##shi", hour).replace("##fen", minute));
//									logger.info("给家长发送短信成功"+cardtimeAll+oneAttencetime.getParentmoblie());
//								}
//								
//							}
//						}
//
//						
//				  }
//			  }
//			       
//			  if(!"".equals(successNo)){
//				  successNo = successNo.substring(0,successNo.length()-1);
//				  
//				  int successTotal=successNo.split(",").length;
//				  if(successTotal>0&&successTotal<total){
//					  resultCode=Constants.ATTENDANCE_SUCCESSNO_PART_ERROR;
//					  resultMessage="部分成功，部分失败";
//				  }
//				  
//			  }
//			  
//			  if("".equals(successNo)&&total>0){
//				  resultCode=Constants.ATTENDANCE_SUCCESSNO_ALL_ERROR;
//				  resultMessage="全部失败";
//			  }
//			  WsResultInfo ws = new WsResultInfo();
//			  ws.setStreamingNo(streamingNo);
//			  ws.setResultCode(resultCode);
//			  ws.setResultMessage(resultMessage);
//			  ws.setSuccessNo(successNo);
//			  return ws;
//		} catch (Exception e) {
//			resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//			resultMessage="系统异常";
//		    WsResultInfo ws = new WsResultInfo();
//		    ws.setStreamingNo(streamingNo);
//		    ws.setResultCode(resultCode);
//		    ws.setResultMessage(resultMessage);
//		    ws.setSuccessNo(successNo);
//			logger.error(e.getMessage());
//			return ws;
//		}
//	}
//	
//	
//	@Override
//	public WsContactInfoResultInfo GetConsumeTokenService(String timestamp,
//			String hashedPwd, String userNo, String machineNo, String spId,
//			String schoolNo) {
//		String resultCode=Constants.ATTENDANCE_SUCCESS;
//		String resultMessage="成功";
//		try {
//			logger.info("进入亲情号码接口");
//			String checkpwd=spId + schoolNo + machineNo + userNo + timestamp+Config.getString("interfacePwd");
//			if(hashedPwd != null && hashedPwd.equalsIgnoreCase(DES.getMD5(checkpwd))){
//				  logger.info("MD5密码匹配");
//			  }else{
//				  resultCode=Constants.ATTENDANCE_PASSWORD_ERROR;
//				  resultMessage="MD5密码不对";
//				  logger.error("MD5密码不对");
//				  WsContactInfoResultInfo ws = new WsContactInfoResultInfo();
//				  ws.setStreamNo("");
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  ws.setUsedSecond(0);
//				  ws.setUseSecond(0);
//				  ws.setContacts(null);
//				  return ws;
//			  }
//			
//			
//			DeviceSchool device= new DeviceSchool();
//			device.setDeviceCode(machineNo);
//			device.setFactoryId(1l);
//			
//			List<DeviceSchool> devicelist=deviceSchoolService.selectByDeviceCode(device);
//			//判断考勤机代码是否有效
//			if(devicelist==null||devicelist.size()==0){
//				logger.info("the device  doesn't existed or the device has not been passed"+machineNo);
//				resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//				  resultMessage="考勤机设备号无效";
//				  logger.error("考勤机设备号无效");
//				  WsContactInfoResultInfo ws = new WsContactInfoResultInfo();
//				  ws.setStreamNo("");
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  ws.setUsedSecond(0);
//				  ws.setUseSecond(0);
//				  ws.setContacts(null);
//				  return ws;
//			}
//			
//			
//			Student cardstu=new Student();
//			cardstu.setAttendanceCard(userNo);
//			cardstu.setDeviceCode(machineNo);
//			List<Student> l=studentMapper.findByAttendanceCard(cardstu);
//			
//			//判断卡号是否有效
//			if(l==null||l.size()==0){
//				logger.info("the user of the card doesn't existed or the user has not been passed"+userNo);
//				resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//				  resultMessage="卡号无效";
//				  logger.error("卡号无效");
//				  WsContactInfoResultInfo ws = new WsContactInfoResultInfo();
//				  ws.setStreamNo("");
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  ws.setUsedSecond(0);
//				  ws.setUseSecond(0);
//				  ws.setContacts(null);
//				  return ws;
//			}
//			
//			FamilyCard familyCard=new FamilyCard();
//			familyCard.setAttendanceCard(userNo);
//			List<FamilyCard> list=familyCardService.findContactsByCard(familyCard);
//			if(list!=null&&list.size()>0){
//				logger.info(userNo+"亲情号码数目:"+list.size());
//			}else{
//				logger.info(userNo+"没有亲情号码");
//			}
//			 
//			List<ContactInfo> contacts=new ArrayList<ContactInfo>();
//			int useSecond=0;
//			int usedSecond=0;
//			Student  stu=studentMapper.findByAttendanceNum(userNo);
//			if(stu!=null&&stu.getFamilyDate()!=null&&!"".equals(stu.getFamilyDate())){
//				useSecond=Integer.parseInt(stu.getFamilyDate());
//			}
//			if(list!=null&&list.size()>0){
//				for(FamilyCard card:list){
//					ContactInfo contact=new ContactInfo();
//					contact.setContactId(card.getId().intValue());
//					contact.setTelephone(card.getMobile());
//					contact.setContactName(card.getRelationship());
//					contacts.add(contact);
//				}
//			}
//			ContactInfo rescontact=new ContactInfo();
//			  WsContactInfoResultInfo ws = new WsContactInfoResultInfo();
//			  ws.setStreamNo(UUID.randomUUID().toString());
//			  ws.setResultCode(resultCode);
//			  ws.setResultMessage(resultMessage);
//			  ws.setUsedSecond(usedSecond);
//			  ws.setUseSecond(useSecond);
//			  rescontact.setContactInfo(contacts);
//			  ws.setContacts(rescontact);
//			  return ws;
//		} catch (Exception e) {
//			resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//			resultMessage="系统异常";
//			WsContactInfoResultInfo ws = new WsContactInfoResultInfo();
//		    ws.setResultCode(resultCode);
//		    ws.setResultMessage(resultMessage);
//		    ws.setStreamNo("");
//		    ws.setUsedSecond(0);
//			ws.setUseSecond(0);
//			ws.setContacts(null);
//			logger.error(e.getMessage());
//			return ws;
//		}
//	
//	}
//
//	@Override
//	public WsResultInfo SyncBillService(String spId, String schoolNo,
//			String machineNo, String timestamp, String hashedPwd,
//			BillInfo billInfo) {
//		String resultCode=Constants.ATTENDANCE_SUCCESS;
//		String resultMessage="成功";
//		int total = 0 ;
//		int successTotal=0;
//		String successNo="";
//		try {
//			logger.info("话单数据上传");
//			String checkpwd=spId + schoolNo + machineNo + timestamp+Config.getString("interfacePwd");
//			if(hashedPwd != null && hashedPwd.equalsIgnoreCase(DES.getMD5(checkpwd))){
//				  logger.info("MD5密码匹配");
//			 }else{
//				  resultCode=Constants.ATTENDANCE_PASSWORD_ERROR;
//				  resultMessage="MD5密码不对";
//				  logger.error("MD5密码不对");
//				  WsResultInfo ws = new WsResultInfo();
//				  ws.setSuccessNo("");
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  return ws;
//			 }
//			
//			DeviceSchool device= new DeviceSchool();
//			device.setDeviceCode(machineNo);
//			device.setFactoryId(1l);
//			
//			List<DeviceSchool> devicelist=deviceSchoolService.selectByDeviceCode(device);
//			//判断考勤机代码是否有效
//			if(devicelist==null||devicelist.size()==0){
//				logger.info("the device  doesn't existed or the device has not been passed"+machineNo);
//				resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//				  resultMessage="考勤机设备号无效";
//				  logger.error("考勤机设备号无效");
//				  WsResultInfo ws = new WsResultInfo();
//				  ws.setSuccessNo("");
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  return ws;
//			}
//			if(billInfo!=null&&billInfo.getBillInfo().size()>0){
//				 total=billInfo.getBillInfo().size();
//				 for(BillInfo bl:billInfo.getBillInfo()){
//					 studentBillMapper.insertSelective(bl);
//					 successNo+=bl.getStreamNo()+",";
//				 }
//				// successTotal=studentBillMapper.insertList(billInfo.getBillInfo());
//			}
//			if(!"".equals(successNo)){
//				  successNo = successNo.substring(0,successNo.length()-1);
//				  
//				   successTotal=successNo.split(",").length;
//				  if(successTotal>0&&successTotal<total){
//					  resultCode=Constants.ATTENDANCE_SUCCESSNO_PART_ERROR;
//					  resultMessage="部分成功，部分失败";
//				  }
//				  
//			  }
//			  
//			  if("".equals(successNo)&&total>0){
//				  resultCode=Constants.ATTENDANCE_SUCCESSNO_ALL_ERROR;
//				  resultMessage="全部失败";
//			  }
//			
//			 WsResultInfo ws = new WsResultInfo();
//			  ws.setSuccessNo(successNo);
//			  ws.setResultCode(resultCode);
//			  ws.setResultMessage(resultMessage);
//			  return ws;
//			
//		}catch(Exception e){
//			resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//			resultMessage="系统异常";
//		    WsResultInfo ws = new WsResultInfo();
//		    ws.setSuccessNo(successNo);
//		    ws.setResultCode(resultCode);
//		    ws.setResultMessage(resultMessage);
//			logger.error(e.getMessage());
//			e.printStackTrace();
//			return ws;
//		}
//		
//	}
//	
//	@Override
//	public WsResultInfo HeartbeatService(String timeStamp,
//			String hashedPwd, String streamingNo,
//			String spId, String schoolNo) {
//		// TODO Auto-generated method stub
//		String resultCode=Constants.ATTENDANCE_SUCCESS;
//		String resultMessage="成功";
//		int length=streamingNo.length();
//		try {
//			logger.info("进入心跳");
//			 Date timeStampdate=DateUtil.parseToDateOther(timeStamp);
//			  Date newDate= new Date();
//			  if(Math.abs(newDate.getTime()-timeStampdate.getTime())>5*60*1000){
//				  resultCode=Constants.ATTENDANCE_TIMESTAMP_ERROR;
//				  resultMessage="时间失效";
//				  logger.error("时间失效");
//				  WsResultInfo ws = new WsResultInfo();
//				  ws.setStreamingNo(streamingNo);
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  return ws;
//			  }
//			  String checkpwd=spId+streamingNo+schoolNo+
//					  timeStamp+Config.getString("interfacePwd");
//			  if(hashedPwd != null && hashedPwd.equalsIgnoreCase(DES.getMD5(checkpwd))){
//				  logger.info("MD5密码匹配");
//			  }else{
//				  resultCode=Constants.ATTENDANCE_PASSWORD_ERROR;
//				  resultMessage="MD5密码不对";
//				  logger.error("MD5密码不对");
//				  WsResultInfo ws = new WsResultInfo();
//				  ws.setStreamingNo(streamingNo);
//				  ws.setResultCode(resultCode);
//				  ws.setResultMessage(resultMessage);
//				  return ws;
//			  }
//			if(length>14){
//				length=length-14;
//				String deviceId=streamingNo.substring(0, length);
//				DeviceSchool device= new DeviceSchool();
//				device.setDeviceCode(deviceId);
//				device.setFactoryId(1l);
//				logger.info("判断deviceId"+deviceId);
//				List<DeviceSchool> devicelist=deviceSchoolService.selectByDeviceCode(device);
//				//判断公话ID是否有效
//				if(devicelist!=null&&devicelist.size()>0){
//					logger.info("deviceId有效"+deviceId);
//					DeviceSchool ds=new DeviceSchool();
//					ds.setId(devicelist.get(0).getId());
//					ds.setHeartTime(new Date());
//					ds.setState(1);
//					deviceSchoolService.updateByHeartTime(ds);
//					WsResultInfo ws = new WsResultInfo();
//				    ws.setStreamingNo(streamingNo);
//				    ws.setResultCode(resultCode);
//				    ws.setResultMessage(resultMessage);
//					return ws;
//				}else{
//					logger.error("deviceId无效"+deviceId);
//					resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//					resultMessage="machineNo不存在";
//					WsResultInfo ws = new WsResultInfo();
//				    ws.setStreamingNo(streamingNo);
//				    ws.setResultCode(resultCode);
//				    ws.setResultMessage(resultMessage);
//					return ws;
//				}
//			}else{
//				logger.error("streamingNo数据不对");
//				resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//				resultMessage="machineNo不存在";
//				WsResultInfo ws = new WsResultInfo();
//			    ws.setStreamingNo(streamingNo);
//			    ws.setResultCode(resultCode);
//			    ws.setResultMessage(resultMessage);
//				return ws;
//			}
//		} catch (Exception e) {
//			resultCode=Constants.ATTENDANCE_OTHER_ERROR;
//			resultMessage="系统异常";
//		    WsResultInfo ws = new WsResultInfo();
//		    ws.setStreamingNo(streamingNo);
//		    ws.setResultCode(resultCode);
//		    ws.setResultMessage(resultMessage);
//			logger.error(e.getMessage());
//			e.printStackTrace();
//			return ws;
//		}
//		
//		
//	}
//	
//	 
//	
//
//}
