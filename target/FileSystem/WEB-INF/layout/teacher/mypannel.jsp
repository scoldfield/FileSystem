<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://shiro.apache.org/tags" prefix="shiro" %>

<shiro:hasPermission name="my:today">
<div class="g-mypannel">
    <div class="g-pannelwrap f-cb">
        <a class="controller j-controller">展开</a>
        <div class="wrap">
            <h2>我的今日</h2>
            
            <div class="pannel-part f-cb">
                <span class="icon icon-1"></span>
                <div class="pannel-content">
                    <h3>待办事项</h3>
                    <ul class="pannelul">
                        <%-- <shiro:hasRole name="班主任"> --%>
                        <shiro:hasPermission name="my:todo">
                            <li><a href="${pageContext.request.contextPath}/teacher/askforleaves/list?type=0" class="classNum j-applicationNum">加载中...</a>人申请请假</li>
                        </shiro:hasPermission>
                        <%-- <shiro:hasRole name="班主任"> --%>
                        <shiro:hasPermission name="my:todo">
                            <li><a href="${pageContext.request.contextPath}/teacher/student/applylist" class="classNum j-askforleaveNum">加载中...</a>人申请加入班级</li>
                        </shiro:hasPermission>
                       
                        <li><a href="${pageContext.request.contextPath}/teacher/schoolnotice/receiveNotice" class="classNum j-receiveNoticeNum">加载中...</a> 条新通知</li>
                    </ul>
                </div>
            </div>

            <shiro:hasPermission name="my:homework">
                <div class="pannel-part f-cb">
                    <span class="icon icon-2"></span>
                    <div class="pannel-content">
                        <h3>今日作业</h3>
                        <ul class="pannelul j-hwList">
                            <li>加载中...</li>
                        </ul>
                    </div>
                </div>
            </shiro:hasPermission>
            
            <%-- <shiro:hasRole name="班主任"> --%>
            <shiro:hasPermission name="my:attend">
                <div class="pannel-part f-cb">
                    <span class="icon icon-3"></span>
                    <div class="pannel-content">
                        <h3>班级考勤</h3>
                        <ul class="attendance f-cb">
                            <li>
                                <span class="ti">迟到早退</span>
                                <a class="abig j-attendanceNum" href="${pageContext.request.contextPath}/teacher/attendances/attlist?type=1">...</a>
                            </li>
                            <li>
                                <span class="ti">请假</span>
                                <a class="abig j-leaveNum" href="${pageContext.request.contextPath}/teacher/askforleaves/list?type=1">...</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </shiro:hasPermission>

            <div class="pannel-part f-cb f-dn">
                <span class="icon icon-4"></span>
                <div class="pannel-content">
                    <h3>班级圈动态</h3>
                    <a class="abig abig-tal" href="">0</a>
                </div>
            </div>

        </div>
    </div>
</div>
</shiro:hasPermission>