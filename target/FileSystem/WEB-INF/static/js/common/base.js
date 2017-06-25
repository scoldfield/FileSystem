/**
 * Document by wangshuyan@chinamobile.com on 2015/11/10 0010.
 */
(function($navWrap, globalPathDeep){


    var globalMenuSubNavGroup = {
        agentVerify: [],
        localAccount: ['/localAccount/create'],
        roleManage: [],
        manageSchool: ['school/addSchool', 'school/update'],
        schoolVerify: ['schoolAudit/auditSchool'],
        manageSchoolaffairs: [],
        manageClasses: [],
        manageTeachers: [],
        manageStudents: [],
        studentInput: [],
        teacherInput: [],
        statisticsQuery: [],
        statisticsDownload: [],
        monitorsManage: [],
        deviceManage: ['device/create', 'device']
    }

    function renderMenu(menuObj){
        var $nav = $('<ul class="m-nav"></ul>');
        /* 处理当前URL 的信息 */
        var urlPathArray = window.location.pathname.split('/'), _urlPathArrayWhile = [];
        for(var upa_i = 0, upa_len = urlPathArray.length; upa_i < upa_len; upa_i++){
            urlPathArray[upa_i] !== '' && _urlPathArrayWhile.push(urlPathArray[upa_i]);
        }
        var pathUrl = '/' + _urlPathArrayWhile.slice(globalPathDeep).join('/');  //得到的pathUrl 会是去除项目目录的路径目录

        if(typeof window.extraNav !== 'undefined'){
            pathUrl = window.extraNav;
        }

        var navList = menuObj.children,
            isActive = '',
            childIsActive = '',
            thisHref = '',
            $li = '',
            $childUl = null,
            $childLi = '',
            childli = null;
        for(var i = 0, ilen = navList.length; i < ilen; i++){
            var liObj = navList[i],
                childs = liObj.children, childsLen = childs.length;
            isActive = '';
            if(childsLen > 0){
                $childUl = $('<ul class="subnav"></ul>');
                $childLi = '';
                for(var j = 0; j < childsLen; j++){
                    childli = childs[j];
                    var childPath = childli.url;
                    thisHref = window.globalPath + childli.url;
                    childIsActive = '';
                    if(pathUrl.indexOf(childPath) >= 0){
                        isActive = ' active';
                        childIsActive = ' active';
                    }else{
                        var subChild = globalMenuSubNavGroup[childli.icon] || []
                        for(var k = 0, jlen = subChild.length; k < jlen; k++){
                            if(location.pathname.indexOf(subChild[k]) >= 0){
                                childIsActive = ' active';
                                isActive = ' active';
                                break;
                            }
                        }
                    }
                    $childLi += ' <li><a class="subnav-a' + childIsActive + '" href="' + thisHref + '"><b></b>' + childli.name + '</a></li>'
                }
                $childUl.append($childLi);
                $li = $('<li class="j-hasChild' + isActive + '"></li>');
                $li.append(' <a class="nav ' + liObj.icon + ' " href="javascript:void(0)">' + liObj.name + '</a>').append($childUl);
            }else{
                if(pathUrl.indexOf(liObj.url) >= 0){
                    isActive = ' active';
                    thisHref = 'javascript:void(0)'
                }else{
                    isActive = '';
                    thisHref = window.globalPath + liObj.url;
                }
                $li = '<li class="' + isActive + '"><a class="nav ' + liObj.icon + ' " href="' + thisHref + '">' + liObj.name + '</a></li>';
            }
            $nav.append($li);
        }
        $nav.delegate('li.j-hasChild > a', 'click', function(){
            var $this = $(this).parent('li');
            if($this.is('.active')){
                $this.removeClass('active');
            }else{
                $this.siblings().removeClass('active');
                $this.addClass('active');
            }
        });
        $navWrap.append($nav);
    }

    $.ajax({
        url: window.globalPath + '/menu',
        type: 'POST',
        async: false,
        success: function(res){
            renderMenu(JSON.parse(res));
        }
    });
})($('.g-nav'), 1);

/* 用户信息 */
(function(){
    $.ajax({
        url: window.globalPath + '/indexUser',
        type: 'POST',
        dataType: 'json',
        success: function(res){
            if(res.imageUrl != null){
                $('#face').attr("src", res.imageUrl);
            }
        }
    })
})()