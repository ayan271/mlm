// config
// 下面四行不要修改，部署到容器时会被环境变量替换
var StaticHost;
var StaticPort;
var ApiHost;
var ApiPort;

var gConfig = {
    localhost: {
        apiHost: "http://localhost:20200",
        sdkHost: "http://localhost:20200",
        opensdkHost: "http://localhost:20300",
        staticHost:"http://localhost:20400",
        robotUri: "localhost:20760"
    },
    development: {
        apiHost: "http://test.gzleidi.cn:81",
        sdkHost: "http://test.gzleidi.cn:81",
        opensdkHost: "http://test.gzleidi.cn:20300",
        staticHost:"http://test.gzleidi.cn",
        robotUri: "test.gzleidi.cn/robot"
    },
    production: {
        apiHost: "http://api.mx.jamma.cn",
        sdkHost: "http://api.mx.jamma.cn",
        opensdkHost: "http://api.mx.jamma.cn",
        staticHost:"http://api.mx.jamma.cn"
    }
};

gConfig = gConfig['production'];

var staticHost;
var apiHost;
var sdkHost;
var opensdkHost;
var robotUri;

StaticHost && (staticHost = 'http://' + StaticHost);
StaticPort && (staticHost += ':' + StaticPort);
ApiHost && (apiHost = 'http://' + ApiHost);
ApiPort && (apiHost += ':' + ApiPort);
ApiHost && (robotUri = ApiHost);
ApiPort && (robotUri += ':' + ApiPort);

staticHost || (staticHost = gConfig.staticHost);
apiHost || (apiHost = gConfig.apiHost);
sdkHost || (sdkHost = gConfig.sdkHost || apiHost);
opensdkHost || (opensdkHost = gConfig.opensdkHost || apiHost);
robotUri || (robotUri = gConfig.robotUri);

var meixia = apiHost;
var perUri = apiHost+"/acl";
var ssoUri = apiHost+"/sso";
var aclUri = apiHost+"/acl";
var adminUri = apiHost+"/admin";
var omsUri = apiHost+"/oms";
var appMgrUri = apiHost + "/appManager";
var agentUri = apiHost + "/agent";
var configUri = apiHost + "/config";
var uploadUri = apiHost + "/upload";
var staticUri = staticHost + "/static";
var activityUri = apiHost + "/activity";
var propUri = apiHost + "/prop";
var depotUri = apiHost + "/depot";
var payUri = apiHost + "/pay";
var bbsUri = apiHost + "/bbs";
var wordfilterUri = apiHost + "/wordfilter";
var packUri = apiHost + "/pack";
var statUri = apiHost + "/stat";
var cardUri = apiHost + "/card";
var homeUri = apiHost + "/home";
var recordUri = apiHost + "/record";
var guestbookUri = apiHost + "/guestbook";
var shopUri = apiHost + "/shop";
var logUri = apiHost + "/log";
var baoxiangUri = apiHost + "/baoxiang";
var bankUri = apiHost + "/bank";
var algUri = apiHost + "/alg";


jm.sdk.init({uri: apiHost});

var domain = '';
var host = document.domain;
if(domain&&host.indexOf(domain)>=0){
    document.domain = domain;
}

var omsnav = "nav_new";

const pfm_cy = 'static';
const pfm_oms = 'oms';
var omsPlatform = pfm_cy;

var plat;