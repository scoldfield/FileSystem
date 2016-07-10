package com.cmcc.filesystem.controller;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadBase;
import org.apache.commons.fileupload.ProgressListener;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.test.context.ContextLoader;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.cmcc.filesystem.constant.Constants;
import com.cmcc.filesystem.dto.FileDto;
import com.cmcc.filesystem.entity.Dept;
import com.cmcc.filesystem.entity.File;
import com.cmcc.filesystem.entity.User;
import com.cmcc.filesystem.service.IDeptService;
import com.cmcc.filesystem.service.IFileService;
import com.cmcc.filesystem.service.IUserService;
import com.cmcc.filesystem.util.DtoUtils;

import io.jsonwebtoken.lang.Collections;

@Controller
@RequestMapping("/fileMng")
public class FileMngController {

	@Autowired
	private IFileService fileService;

	@Autowired
	private IDeptService deptService;

	@Autowired
	private IUserService userService;

	@Autowired
	private DtoUtils dtoUtils;

	/*
	 * 显示所有部门审核后的档案
	 */
	@RequestMapping("/list")
	public String list(Model model) throws IllegalAccessException, InvocationTargetException {
		List<FileDto> fileDtos = new ArrayList<FileDto>();
		List<File> files = fileService.findAll();
		if (files.size() > 0) {
			for (File f : files) {
				FileDto fileDto = dtoUtils.fileToFileDto(f);
				fileDtos.add(fileDto);
			}
		}

		model.addAttribute("fileDtos", fileDtos);
		return "file/list";
	}

	@RequestMapping("/add")
	public String add(Model model) {
		List<Dept> depts = deptService.findAll();
		model.addAttribute("depts", depts);

		// 发文类型generate_type
		String[] generateTypes = Constants.GENERATE_TYPES.split(",");
		List<String> generateTypeList = Collections.arrayToList(generateTypes);
		if (generateTypes.length > 0) {
			model.addAttribute("generateTypes", generateTypeList);
		}

		// 等级（特提、特急、加急、平级）
		String[] emergencyLevels = Constants.EMERGENCY_LEVEL.split(",");
		if (emergencyLevels.length > 0) {
			model.addAttribute("emergencyLevels", emergencyLevels);
		}

		// 密级（绝密、机密、秘密、内部、普通）
		String[] secretLevels = Constants.SECRET_LEVEL.split(",");
		if (secretLevels.length > 0) {
			model.addAttribute("secretLevels", secretLevels);
		}

		return "file/add";
	}

	@RequestMapping(value = "/addPost", method = RequestMethod.POST)
	public String addPost(FileDto fileDto) throws IllegalAccessException, InvocationTargetException, ParseException {
		if (fileDto != null) {
			File file = dtoUtils.fileDtoToFile(fileDto);
			String username = (String) SecurityUtils.getSubject().getPrincipal();
			User user = userService.findByUsername(username);
			file.setReceiveUserId(user.getId());
			file.setState(Boolean.TRUE);
			fileService.insertSelective(file);
		}

		return "redirect:list";
	}

	@RequestMapping("/edit")
	public String edit(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
		File file = fileService.selectByPrimaryKey(fileId);
		if (file != null) {
			FileDto fileDto = dtoUtils.fileToFileDto(file);
			model.addAttribute("fileDto", fileDto);
		}

		List<Dept> depts = deptService.findAll();
		model.addAttribute("depts", depts);

		// 发文类型generate_type
		String[] generateTypes = Constants.GENERATE_TYPES.split(",");
		List<String> generateTypeList = Collections.arrayToList(generateTypes);
		if (generateTypes.length > 0) {
			model.addAttribute("generateTypes", generateTypeList);
		}

		// 等级（特提、特急、加急、平级）
		String[] emergencyLevels = Constants.EMERGENCY_LEVEL.split(",");
		if (emergencyLevels.length > 0) {
			model.addAttribute("emergencyLevels", emergencyLevels);
		}

		// 密级（绝密、机密、秘密、内部、普通）
		String[] secretLevels = Constants.SECRET_LEVEL.split(",");
		if (secretLevels.length > 0) {
			model.addAttribute("secretLevels", secretLevels);
		}

		return "file/edit";
	}

	@RequestMapping(value = "/editPost", method = RequestMethod.POST)
	public String editPost(FileDto fileDto, Model model)
			throws IllegalAccessException, InvocationTargetException, ParseException {
		if (fileDto != null) {
			File file = dtoUtils.fileDtoToFile(fileDto);
			file.setState(Boolean.TRUE);
			fileService.updateSelective(file);
		}
		return "redirect:list";
	}

	@RequestMapping("/detail")
	public String detail(String fileId, Model model) throws IllegalAccessException, InvocationTargetException {
		File file = fileService.selectByPrimaryKey(fileId);
		if (file != null) {
			FileDto fileDto = dtoUtils.fileToFileDto(file);
			model.addAttribute("fileDto", fileDto);
		}

		return "file/detail";
	}

	@RequestMapping("/delete")
	public String delete(String fileId, Model model) {
		File file = fileService.selectByPrimaryKey(fileId);
		if (file != null) {
			file.setState(Boolean.FALSE);
			fileService.updateSelective(file);
		}

		return "redirect:list";
	}

	@RequestMapping("/upload")
	public String upload(String fileId, Model model) {
		model.addAttribute("fileId", fileId);
		return "file/upload";
	}

//	@RequestMapping(value = "/uploadPost", method = RequestMethod.POST)
//	public String uploadPost(/* String fileId, String file1, */HttpServletRequest request, HttpServletResponse response,
//			Model model) {
//		// 得到上传文件的保存目录，将上传的文件存放于WEB-INF目录下，不允许外界直接访问，保证上传文件的安全
////		String savePath = request.getRealPath("/WEB-INF/upload");
//		String savePath = "Q:\\upload";
//		// 上传时生成的临时文件保存目录
////		String tempPath = request.getRealPath("/WEB-INF/temp");
//		String tempPath = "Q:\\temp";
//		java.io.File tmpFile = new java.io.File(tempPath);
//		if (!tmpFile.exists()) {
//			// 创建临时目录
//			tmpFile.mkdir();
//		}
//
//		// 消息提示
//		String message = "";
//		try {
//			// 使用Apache文件上传组件处理文件上传步骤：
//			// 1、创建一个DiskFileItemFactory工厂
//			DiskFileItemFactory factory = new DiskFileItemFactory();
//			// 设置工厂的缓冲区的大小，当上传的文件大小超过缓冲区的大小时，就会生成一个临时文件存放到指定的临时目录当中。
//			factory.setSizeThreshold(1024 * 100);// 设置缓冲区的大小为100KB，如果不指定，那么缓冲区的大小默认是10KB
//			// 设置上传时生成的临时文件的保存目录
//			factory.setRepository(tmpFile);
//			// 2、创建一个文件上传解析器
//			ServletFileUpload upload = new ServletFileUpload(factory);
//			// 监听文件上传进度
//			upload.setProgressListener(new ProgressListener() {
//				public void update(long pBytesRead, long pContentLength, int arg2) {
//					System.out.println("文件大小为：" + pContentLength + ",当前已处理：" + pBytesRead);
//					/**
//					 * 文件大小为：14608,当前已处理：4096 文件大小为：14608,当前已处理：7367
//					 * 文件大小为：14608,当前已处理：11419 文件大小为：14608,当前已处理：14608
//					 */
//				}
//			});
//			// 解决上传文件名的中文乱码
//			upload.setHeaderEncoding("UTF-8");
//			// 3、判断提交上来的数据是否是上传表单的数据
//			if (!ServletFileUpload.isMultipartContent(request)) {
//				// 按照传统方式获取数据
//				return null;
//			}
//
//			// 设置上传单个文件的大小的最大值，目前是设置为1024*1024字节，也就是1MB
//			upload.setFileSizeMax(1024 * 1024);
//			// 设置上传文件总量的最大值，最大值=同时上传的多个文件的大小的最大值的和，目前设置为10MB
//			upload.setSizeMax(1024 * 1024 * 10);
//			// 4、使用ServletFileUpload解析器解析上传数据，解析结果返回的是一个List<FileItem>集合，每一个FileItem对应一个Form表单的输入项
//			List<FileItem> list = upload.parseRequest(request);
//			for (FileItem item : list) {
//				// 如果fileitem中封装的是普通输入项的数据
//				if (item.isFormField()) {
//					String name = item.getFieldName();
//					// 解决普通输入项的数据的中文乱码问题
//					String value = item.getString("UTF-8");
//					// value = new String(value.getBytes("iso8859-1"),"UTF-8");
//					System.out.println(name + "=" + value);
//				} else {// 如果fileitem中封装的是上传文件
//						// 得到上传的文件名称，
//					String filename = item.getName();
//					System.out.println(filename);
//					if (filename == null || filename.trim().equals("")) {
//						continue;
//					}
//					// 注意：不同的浏览器提交的文件名是不一样的，有些浏览器提交上来的文件名是带有路径的，如：
//					// c:\a\b\1.txt，而有些只是单纯的文件名，如：1.txt
//					// 处理获取到的上传文件的文件名的路径部分，只保留文件名部分
//					filename = filename.substring(filename.lastIndexOf("\\") + 1);
//					// 得到上传文件的扩展名
//					String fileExtName = filename.substring(filename.lastIndexOf(".") + 1);
//					// 如果需要限制上传的文件类型，那么可以通过文件的扩展名来判断上传的文件类型是否合法
//					System.out.println("上传的文件的扩展名是：" + fileExtName);
//					// 获取item中的上传文件的输入流
//					InputStream in = item.getInputStream();
//					// 得到文件保存的名称
//					String saveFilename = makeFileName(filename);
//					// 得到文件的保存目录
//					String realSavePath = makePath(saveFilename, savePath);
//					// 创建一个文件输出流
//					FileOutputStream out = new FileOutputStream(realSavePath + "\\" + saveFilename);
//					// 创建一个缓冲区
//					byte buffer[] = new byte[1024];
//					// 判断输入流中的数据是否已经读完的标识
//					int len = 0;
//					// 循环将输入流读入到缓冲区当中，(len=in.read(buffer))>0就表示in里面还有数据
//					while ((len = in.read(buffer)) > 0) {
//						// 使用FileOutputStream输出流将缓冲区的数据写入到指定的目录(savePath + "\\"
//						// + filename)当中
//						out.write(buffer, 0, len);
//					}
//					// 关闭输入流
//					in.close();
//					// 关闭输出流
//					out.close();
//					// 删除处理文件上传时生成的临时文件
//					// item.delete();
//					message = "文件上传成功！";
//				}
//			}
//		} catch (FileUploadBase.FileSizeLimitExceededException e) {
//			e.printStackTrace();
//			message =  "单个文件超出最大值！！！";
//			return null;
//		} catch (FileUploadBase.SizeLimitExceededException e) {
//			e.printStackTrace();
//			message =  "上传文件的总的大小超出限制的最大值！！！";
//			return null;
//		} catch (Exception e) {
//			message = "文件上传失败！";
//			e.printStackTrace();
//		}
//
//		model.addAttribute("message",message);
//		return"file/message";
//	}
//
//
///**
//* @Method: makeFileName
//* @Description: 生成上传文件的文件名，文件名以：uuid+"_"+文件的原始名称
//* @Anthor:孤傲苍狼
//* @param filename 文件的原始名称
//* @return uuid+"_"+文件的原始名称
//*/ 
//private String makeFileName(String filename){  //2.jpg
////为防止文件覆盖的现象发生，要为上传文件产生一个唯一的文件名
//return UUID.randomUUID().toString() + "_" + filename;
//}
//
//	/**
//	 * 为防止一个目录下面出现太多文件，要使用hash算法打散存储
//	 * 
//	 * @Method: makePath
//	 * @Description:
//	 * @Anthor:孤傲苍狼
//	 *
//	 * @param filename
//	 *            文件名，要根据文件名生成存储目录
//	 * @param savePath
//	 *            文件存储路径
//	 * @return 新的存储目录
//	 */
//	private String makePath(String filename, String savePath) {
//		// 得到文件名的hashCode的值，得到的就是filename这个字符串对象在内存中的地址
//		int hashcode = filename.hashCode();
//		int dir1 = hashcode & 0xf; // 0--15
//		int dir2 = (hashcode & 0xf0) >> 4; // 0-15
//		// 构造新的保存目录
//		String dir = savePath + "\\" + dir1 + "\\" + dir2; // upload\2\3
//															// upload\3\5
//		// File既可以代表文件也可以代表目录
//		java.io.File file = new java.io.File(dir);
//		// 如果目录不存在
//		if (!file.exists()) {
//			// 创建目录
//			file.mkdirs();
//		}
//		return dir;
//	}
	
	@RequestMapping(value = "/uploadPost", method = RequestMethod.POST)
	public String uploadPost(@RequestParam(value="file1", required=false) MultipartFile file1, String fileId, HttpServletRequest request, HttpServletResponse response, Model model) {
		
		//上传档案的存储地址
		String path = Constants.FILE_PATH;
		System.out.println("开始上传......");  
        String fileName = file1.getOriginalFilename();
        System.out.println("path = " + path);  
        java.io.File targetFile = new java.io.File(path, fileName);  
        if(!targetFile.exists()){  
            targetFile.mkdirs();  
        }  
  
        String message = "文件无法上传";
        //保存  
        try {  
            //上传文件
        	file1.transferTo(targetFile);  
            String targetFilePath = targetFile.getPath();
           
            //sys_file表中更新该文件
            if(StringUtils.hasText(fileId)){
            	File file = fileService.selectByPrimaryKey(fileId);
            	if(file != null){
            		file.setLocation(targetFilePath);
            		fileService.updateSelective(file);
            	}
            }
            
        } catch (Exception e) {  
        	message = "文件上传失败";
            e.printStackTrace();  
        }  
		
        
        message = "文件上传成功";
		model.addAttribute("message",message);
		return"file/message";
	}
	
//    @RequestMapping("/download")
//    public ResponseEntity<byte[]> download(String fileId) throws IOException {
//    	File file = fileService.selectByPrimaryKey(fileId);
//    	java.io.File targetFile = null;
//    	HttpHeaders headers = null;
//    	
//    	if(file != null){
//    		//获取待下载的文件的存储位置
//    		String location = file.getLocation();
//    		//生成该文件对象
//    		if(StringUtils.hasText(location)){
//    			//获取文件名
//    			int start = location.lastIndexOf("\\");
//    			String name = location.substring(start + 1, location.length());
//    			name = new String(name.getBytes("utf-8"), "iso-8859-1");	//解决下载文件的中文乱码问题
//    			
//    			targetFile = new java.io.File(location);
//    			headers = new HttpHeaders();
//    			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//    			headers.setContentDispositionFormData("attachment", name);
//    		}
//    	}
//
//    	return new ResponseEntity<byte[]>(FileUtils.readFileToByteArray(targetFile), headers, HttpStatus.CREATED);
//    }
    
    @RequestMapping("/download")
    public void download(String fileId, HttpServletResponse resp) throws IOException {
    	File file = fileService.selectByPrimaryKey(fileId);
    	java.io.File targetFile = null;
    	OutputStream out = null;
    	
    	if(file != null){
    		//获取待下载的文件的存储位置
    		String location = file.getLocation();
    		//生成该文件对象
    		if(StringUtils.hasText(location)){
    			//获取文件名
    			int start = location.lastIndexOf("\\");
    			String name = location.substring(start + 1, location.length());
    			name = new String(name.getBytes("utf-8"), "iso-8859-1");	//解决下载文件的中文乱码问题
    			targetFile = new java.io.File(location);

    			try {
    				resp.reset();
    				resp.setContentType("application/octet-stream; charset=utf-8"); 
    				resp.setHeader("Content-Disposition", "attachment; filename=" + name);
    				out = resp.getOutputStream(); 
    				out.write(FileUtils.readFileToByteArray(targetFile)); 
    				out.flush();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					if(out != null){
						try {
							out.close();
						} catch (Exception e2) {
							e2.printStackTrace();
						}
					}
				}
    		}
    	}
    }
}