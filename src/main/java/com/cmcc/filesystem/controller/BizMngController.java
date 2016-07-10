package com.cmcc.filesystem.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.dto.FileDto;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.entity.Table;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.entity.UserDeptRole;
import com.cmcc.filesystem.service.IBorrowAuditService;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IFileService;
import com.cmcc.filesystem.service.IRoleService;
import com.cmcc.filesystem.service.IUserDeptRoleService;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.util.DtoUtils;

import javafx.scene.control.Tab;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

@Controller
@RequestMapping("/biz")
public class BizMngController {

    @Autowired
    private IFileService fileService;
    
    @Autowired
    private DtoUtils dtoUtils;
    
    @Autowired
    private IUserDeptRoleService userDeptRoleService;
    
    @Autowired
    private IRoleService roleService;
    
    @Autowired
    private IUserService userService;
    
    @Autowired
    private IDeptService deptService;
    
    @Autowired
    private IBorrowAuditService borrowAuditService;
    
    
    @RequestMapping("/receive")
    public String receive() {
        return null;
    }
    
    /*
     * 显示本部门的所有档案，包括待接收审核的档案、已经审核的档案。前者后面的操作显示"去审核"、后者后面的操作选项显示"归档"
     */
    @RequestMapping("/list")
    public String list(Model model) throws IllegalAccessException, InvocationTargetException {
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        if(user != null) {
            UserDeptRole udr = userDeptRoleService.findByUserId(user.getId() + "");
            if(udr != null) {
                Long deptId = udr.getDeptId();
                File file = new File();
                file.setBelongedDeptId(deptId);
//                file.setAuditorId(Constants.RECEIVE_AUDIT_ID);	//auditor_id字段为0表示该档案未被接收审核过
                file.setState(Boolean.TRUE);		//state表示是否被删除
                List<File> files = fileService.findSelective(file);
                if(files.size() > 0) {
                    List<FileDto> fileDtos = new ArrayList<FileDto>();
                    for(File f : files) {
                        FileDto fileDto = dtoUtils.fileToFileDto(f);
                        fileDtos.add(fileDto);
                    }
                    
                    model.addAttribute("fileDtos", fileDtos);
                }
            }
        }
        
        return "biz/list";
    }

    @RequestMapping("/detail")
    public String detail(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
        if(StringUtils.hasText(fileId)) {
            File file = fileService.selectByPrimaryKey(fileId);
            if(file != null) {
                FileDto fileDto = dtoUtils.fileToFileDto(file);
                model.addAttribute("fileDto", fileDto);
            }
        }
        return "biz/detail";
    }
    
    /*
     * "接收审核"，审核本部门他人录入的档案
     */
    @RequestMapping("/receiveAudit")
    public String receiveAudit(String fileId, String res) {    //res:  1:审核通过; -1:审核不通过
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        User user = userService.findByUsername(username);
        
        if(StringUtils.hasText(fileId)) {
            File file = fileService.selectByPrimaryKey(fileId);
            if(file != null) {
                file.setAuditDate(new Date());
                file.setAuditorId(user.getId());
                file.setAuditResult(res);
                file.setAuditSerials(file.getId() + "");     //将audit_serials与file_id一样

                fileService.updateSelective(file);
            }
        }
        
        return "redirect:list";
    }
    
    @RequestMapping("/filling")
    public String filling(String fileId, Model model){
    	File file = fileService.selectByPrimaryKey(fileId);
    	if(file != null){
    		file.setFillingDate(new Date());
    		fileService.updateSelective(file);
    	}
    	
    	return "redirect:list";
    }
    
    
    @SuppressWarnings("deprecation")
    @RequestMapping("/fileTable")
    public String fileTable(Model model, HttpServletResponse resp) throws IOException, RowsExceededException, WriteException {    
        List<File> files = fileService.findAll();
        if(files.size() > 0) {
            
            Map<Integer, Integer> years = new HashMap<Integer, Integer>();      //"2016--总计"这一空格应该填写的内容
            //绝密=1,机密=2,秘密=3,内部=4,普通=5，"用于2016--绝密"这一空格应该填写的内容
            Map<String, Integer> secrIdNumMap = new HashMap<String, Integer>();    	//其中存储的是secreat_level:num
            
            Map<Integer, Table> yearTable = new HashMap<Integer, Table>();		//year:table
            
//            Map<Integer, Integer> secret1 = new HashMap<Integer, Integer>();    
//            Map<Integer, Integer> secret2 = new HashMap<Integer, Integer>();    
//            Map<Integer, Integer> secret3 = new HashMap<Integer, Integer>();    
//            Map<Integer, Integer> secret4 = new HashMap<Integer, Integer>();    
//            Map<Integer, Integer> secret5 = new HashMap<Integer, Integer>();    
            for(File f : files) {
            	//获取年份
                Date generateDate = f.getGenerateDate();
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(generateDate);
                int year = calendar.get(Calendar.YEAR);
                
                //文件secret_level:绝密=1,机密=2,秘密=3,内部=4,普通=5，"
                String secretLevel = f.getSecretLevel();
                String secretLevelId = Constants.SECRET_LEVEL_RESOURCE_ID.get(secretLevel);

                Table table = yearTable.get(year);
                if(table != null){
                	
                	//修改year(其实这个year字段可以不用设置，因为yearTable这个Map中的key值就是year)
                	table.setYear(year);
                	
                	//修改Table中Map中的密级对应的个数
                	Map<String, Integer> secret = table.getSecret();
                	Integer num = secret.get(secretLevelId);
                	if(num == null){
                		secret.put(secretLevelId, 1);
                	} else {
						secret.put(secretLevelId, secret.get(secretLevelId) + 1);
					}
                	
                	//修改yearTotal字段
                	Integer yearTotal = table.getYearTotal();
                	if(yearTotal == null){
                		table.setYearTotal(1);
                	} else {
						table.setYearTotal(table.getYearTotal() + 1);
					}
                } else{
                	Table table2 = new Table();
                	table2.setYear(year);
                	table2.setYearTotal(1);
                	HashMap<String, Integer> secret = new HashMap<String, Integer>();
                	secret.put(secretLevelId, 1);
                	table2.setSecret(secret);
                	
                	yearTable.put(year, table2);
                }
                
                
//                Integer yearNum = years.get(year);
//                if(yearNum != null) {
//                    years.put(year, (yearNum + 1));		//每一行的年份总计
//                } else {
//                    years.put(year, 1);
//                }
//                
//                String secretLevel = f.getSecretLevel();
//                String secretLevelId = Constants.SECRET_LEVEL_RESOURCE_ID.get(secretLevel);
//                
//                Integer num = secrIdNumMap.get(secretLevelId);
//                if(num == null){
//                	secrIdNumMap.put(secretLevelId, 1);
//                } else {
//                	secrIdNumMap.put(secretLevelId, secrIdNumMap.get(secretLevelId) + 1);
//				}
                
                
//                Integer secret1Num = secret1.get(year);
//                Integer secret2Num = secret1.get(year);
//                Integer secret3Num = secret1.get(year);
//                Integer secret4Num = secret1.get(year);
//                Integer secret5Num = secret1.get(year);
//                if(secret1Num != null) {
//                    secret1.put(year, (secret1Num + 1));
//                } else {
//                    secret1.put(year, 1);
//                }
//                if(secret2Num != null) {
//                    secret2.put(year, (secret2Num + 1));
//                } else {
//                    secret2.put(year, 1);
//                }
//                if(secret3Num != null) {
//                    secret3.put(year, (secret3Num + 1));
//                } else {
//                    secret3.put(year, 1);
//                }
//                if(secret4Num != null) {
//                    secret4.put(year, (secret4Num + 1));
//                } else {
//                    secret4.put(year, 1);
//                }
//                if(secret5Num != null) {
//                    secret5.put(year, (secret5Num + 1));
//                } else {
//                    secret5.put(year, 1);
//                }
            }
            
//            Map<Integer, Table> tables = new HashMap<Integer, Table>();
//            List<Table> tables = new ArrayList<Table>();
//            Set<Integer> keys = years.keySet();
//            Iterator<Integer> it = keys.iterator();
//            while(it.hasNext()) {
//                Integer year = it.next();
//                Integer yearNum = years.get(year);
//                Integer secret1Num = secret1.get(year);
//                Integer secret2Num = secret2.get(year);
//                Integer secret3Num = secret3.get(year);
//                Integer secret4Num = secret4.get(year);
//                Integer secret5Num = secret5.get(year);
//                
//                Table t = new Table();
//                t.setYear(year);
//                t.setYearTotal(yearNum);
//                t.setSecret1(secret1Num);
//                t.setSecret2(secret2Num);
//                t.setSecret3(secret3Num);
//                t.setSecret4(secret4Num);
//                t.setSecret5(secret5Num);
//                tables.add(t);
//            }
            
            /*
             * 生成excel报表
             */
            //设置下载环境
            resp.reset();	//清空输出流
            //处理中文名
            resp.setCharacterEncoding("utf-8");
            String filename = "信息统计表";
            filename = URLEncoder.encode(filename, "utf-8");
            resp.setHeader("Content-Disposition","attachment;filename="+new String(filename.getBytes("UTF-8"),"GBK")+".xls");
            resp.setContentType("application/msexcel");//定义输出类型
            
            //创建工作薄
            WritableWorkbook workbook = Workbook.createWorkbook(resp.getOutputStream());
            //创建新的一页
            WritableSheet sheet = workbook.createSheet("My First sheet", 0);
            //创建要显示的内容，创建一个单元格，第一个参数为列左边，第二个参数为行坐标，第三个参数为内容
            Label time = new Label(0, 0, "时间\n统计数量\n档案类型");
            Label secLabel1 = new Label(1, 0, "绝密");
            Label secLabel2 = new Label(2, 0, "机密");
            Label secLabel3 = new Label(3, 0, "秘密");
            Label secLabel4 = new Label(4, 0, "内部");
            Label secLabel5 = new Label(5, 0, "普通");
            Label yearTotal = new Label(6, 0, "总计");
            sheet.addCell(time);
            sheet.addCell(secLabel1);
            sheet.addCell(secLabel2);
            sheet.addCell(secLabel3);
            sheet.addCell(secLabel4);
            sheet.addCell(secLabel5);
            sheet.addCell(yearTotal);
            
            Set<Entry<Integer,Table>> yearTables = yearTable.entrySet();
            int i = 1;
            for(Entry<Integer,Table> yt : yearTables){
            	Integer year = yt.getKey();
            	Table table = yt.getValue();
            	Map<String, Integer> secret = table.getSecret();
            	
            	time = new Label(0, i, year + "");
            	secLabel1 = new Label(1, i, secret.get("1")==null?"0":secret.get("1") + "");
            	secLabel2 = new Label(2, i, secret.get("2")==null?"0":secret.get("2") + "");
            	secLabel3 = new Label(3, i, secret.get("3")==null?"0":secret.get("3") + "");
            	secLabel4 = new Label(4, i, secret.get("4")==null?"0":secret.get("4") + "");
            	secLabel5 = new Label(5, i, secret.get("5")==null?"0":secret.get("5") + "");
            	yearTotal = new Label(6, i, table.getYearTotal() + "");
            	
            	sheet.addCell(time);
                sheet.addCell(secLabel1);
                sheet.addCell(secLabel2);
                sheet.addCell(secLabel3);
                sheet.addCell(secLabel4);
                sheet.addCell(secLabel5);
                sheet.addCell(yearTotal);
                
                i++;
            }
            
            workbook.write();
            workbook.close();
            resp.getOutputStream().close();
            
            
            
//            model.addAttribute("tables", tables);
        }
        
        return null;
    }
}
