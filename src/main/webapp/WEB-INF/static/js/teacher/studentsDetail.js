var urlAr = location.pathname.split('\/'), urlSpAr = [];
for(var url_i in urlAr){
    if(urlAr[url_i] !== ''){
        urlSpAr.push(urlAr[url_i]);
    }
}
var _id = +urlSpAr[urlSpAr.length - 2];
var studentDetailApp = angular.module('studentDetail', []);
studentDetailApp.run(function($rootScope, $http){
    $rootScope.userInfo = {};
    $http({
        url: window.globalPath + '/student/' + _id + '/view',
        method: 'POST',
    }).success(function(data, header, config, status){
        if(data){
            $rootScope.userInfo = data;
            if($rootScope.userInfo.familyCard){
                var ar = $rootScope.userInfo.familyCard.split(';');
                $rootScope.userInfo.familyCardList = [];
                for(var j in ar){
                    if(ar[j] !== ''){
                        $rootScope.userInfo.familyCardList.push(ar[j]);
                    }
                }
                for(var i = 0, len = $rootScope.userInfo.familyCardList.length; i < len; i++){
                    $rootScope.userInfo.familyCardList[i] = $rootScope.userInfo.familyCardList[i].split(',')
                }
            }
        }else{
            alert('获取数据失败！')
        }
    });
});
