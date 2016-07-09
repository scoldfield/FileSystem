package com.cmcc.filesystem.ws;

import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;

import com.cmcc.filesystem.constant.Constants;


@WebService
public interface SyncWorkInfoService {
	

	@WebResult(name = "SyncWorkInfoResult") 
	public WsResultInfo SyncWorkInfo(@WebParam(name="timeStamp",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String timeStamp,
									 @WebParam(name="hashedPwd",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String hashedPwd,
									 @WebParam(name="eventInfo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) EventInfo eventlist,
									 @WebParam(name="streamingNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String streamingNo,
									 @WebParam(name="spId",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String spId,
									 @WebParam(name="schoolNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String schoolNo); 
	
	@WebResult(name = "GetServerTimeResult") 
	public WsResultInfo GetServerTime();
	
	@WebResult(name = "GetConsumeTokenServiceResult") 
	public WsContactInfoResultInfo GetConsumeTokenService(@WebParam(name="timestamp",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String timestamp,
									 @WebParam(name="hashedPwd",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String hashedPwd,
									 @WebParam(name="userNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String userNo,
									 @WebParam(name="machineNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String machineNo,
									 @WebParam(name="spId",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String spId,
									 @WebParam(name="schoolNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String schoolNo); 
	@WebResult(name = "SyncBillServiceResult") 
	public WsResultInfo SyncBillService(
									 @WebParam(name="spId",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String spId,
									 @WebParam(name="schoolNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String schoolNo,
									 @WebParam(name="machineNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String machineNo,
									 @WebParam(name="timestamp",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String timestamp,
									 @WebParam(name="hashedPwd",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String hashedPwd,
									 @WebParam(name="bills",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) BillInfo billInfo);
	@WebResult(name = "HeartbeatServiceResult") 
	public WsResultInfo HeartbeatService(@WebParam(name="timeStamp",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String timeStamp,
									 @WebParam(name="hashedPwd",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String hashedPwd,
									 @WebParam(name="streamingNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String streamingNo,
									 @WebParam(name="spId",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String spId,
									 @WebParam(name="schoolNo",targetNamespace=Constants.ATTENDANCE_TARGETSPACE) String schoolNo); 
									
}
