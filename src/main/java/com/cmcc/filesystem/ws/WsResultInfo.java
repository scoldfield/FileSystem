package com.cmcc.filesystem.ws;

import java.io.Serializable;



public class WsResultInfo implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	String streamingNo;
	
	String resultCode;
	
	String resultMessage;
	
	String successNo;
	
	String usedSecond;
	
	public String getUsedSecond() {
		return usedSecond;
	}

	public void setUsedSecond(String usedSecond) {
		this.usedSecond = usedSecond;
	}

	public String getStreamingNo() {
		return streamingNo;
	}

	public void setStreamingNo(String streamingNo) {
		this.streamingNo = streamingNo;
	}

	public String getResultCode() {
		return resultCode;
	}

	public void setResultCode(String resultCode) {
		this.resultCode = resultCode;
	}

	public String getResultMessage() {
		return resultMessage;
	}

	public void setResultMessage(String resultMessage) {
		this.resultMessage = resultMessage;
	}

	public String getSuccessNo() {
		return successNo;
	}

	public void setSuccessNo(String successNo) {
		this.successNo = successNo;
	}
	
	
	
	

}
