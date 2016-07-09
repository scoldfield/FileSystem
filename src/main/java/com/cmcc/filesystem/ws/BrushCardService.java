package com.cmcc.filesystem.ws;

import javax.jws.WebParam;
import javax.jws.WebService;

@WebService
public interface BrushCardService { 

String acceptBrushCard(@WebParam(name="content") String content); 


}