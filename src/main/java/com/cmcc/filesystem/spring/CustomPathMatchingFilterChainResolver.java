package com.cmcc.filesystem.spring;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.web.filter.mgt.FilterChainManager;
import org.apache.shiro.web.filter.mgt.PathMatchingFilterChainResolver;

import com.cmcc.filesystem.app.util.Config;



public class CustomPathMatchingFilterChainResolver extends PathMatchingFilterChainResolver {

    private CustomDefaultFilterChainManager customDefaultFilterChainManager;

    public void setCustomDefaultFilterChainManager(CustomDefaultFilterChainManager customDefaultFilterChainManager) {
        this.customDefaultFilterChainManager = customDefaultFilterChainManager;
        setFilterChainManager(customDefaultFilterChainManager);
    }

    public FilterChain getChain(ServletRequest request, ServletResponse response, FilterChain originalChain) {
        FilterChainManager filterChainManager = getFilterChainManager();
        if (!filterChainManager.hasChains()) {
            return null;
        }
        
        List<String> listStart =  Arrays.asList(Config.getString("shiro.anno.urlStart").split(","));
        List<String> listEnd =  Arrays.asList(Config.getString("shiro.anno.urlEnd").split(","));

        String requestURI = getPathWithinApplication(request);
        
        boolean flag = false;
        
    	if(listStart != null && listStart.size() > 0){
    		for(String s : listStart){
    			if(requestURI.startsWith(s))
    			{
    				flag = true;
    				break;
    			}
    		}
    	}
    	
    	if(listEnd != null && listEnd.size() > 0){
    		for(String s : listEnd){
    			if(requestURI.endsWith(s))
    			{
    				flag = true;
    				break;
    			}
    		}
    	}
    	
    	
    	if(flag) {
    	    return null;
    	}

        List<String> chainNames = new ArrayList<String>();
        //the 'chain names' in this implementation are actually path patterns defined by the user.  We just use them
        //as the chain name for the FilterChainManager's requirements
       
        for (String pathPattern : filterChainManager.getChainNames()) {
        	
//        	if(requestURI.startsWith("/static")||requestURI.startsWith("/securityCode")||requestURI.startsWith("/code")||requestURI.endsWith(".jpg")
//        			||requestURI.startsWith("/appService")||requestURI.startsWith("/contacts")||requestURI.startsWith("/notice")
//        			||requestURI.startsWith("/examservice")||requestURI.startsWith("/upload")||requestURI.startsWith("/attendance")
//        			||requestURI.startsWith("/homework")||requestURI.startsWith("/askforleave")||requestURI.startsWith("/portrait")
//        			||requestURI.startsWith("/classring")||requestURI.startsWith("/gallery")||requestURI.startsWith("/services")
//        			||requestURI.startsWith("/homeManager")||requestURI.startsWith("/versionFile")||requestURI.startsWith("/appMonitor")
//        			||requestURI.startsWith("/appAttendancetime")||requestURI.startsWith("/recipes")||requestURI.startsWith("/appPoints"))
//    此部分URL配置在system.properties 文件中，以逗号隔开，结尾不留任何空格或者符号
        	
           // If the path does match, then pass on to the subclass implementation for specific checks:
            if (!flag && pathMatches(pathPattern, requestURI)) {
                chainNames.add(pathPattern);
            }
        }

        if(chainNames.size() == 0) {
            return null;
        }

        return customDefaultFilterChainManager.proxy(originalChain, chainNames);
    }
}
