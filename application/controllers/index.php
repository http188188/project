<?php
header("Content-Type: text/html;charset=utf-8");

class Index extends MY_Controller{

public $userName = "zhongshan";
public $requestIp  = "http://10.75.1.110:9090";
    public function __construct() {
        parent::__construct();
        if(base_url() == "http://scm.intra.weibo.com/"){
            $this->check();
            $this->userName = $this->input->cookie("C_user");
            $this->requestIp  = "http://10.210.230.79:9090";
        }
    }

    public function isLogin() {
        if (!isset($_COOKIE['C_user'])) {
            return false;
        }

        $pinstr = json_decode(file_get_contents(sprintf('http://login.intra.weibo.com/api/getpin.php?user=%s', $_COOKIE['C_user'])));
        if ($pinstr != $_COOKIE['C_pin']) {
            return false;
        }

        return true;
    }

    public function check() {
        $islogin = $this->isLogin();
        $url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        if (!$islogin) {
            header("Location: http://login.intra.weibo.com/?url={$url}");
            exit;
        }
        return $url;
    }

    public function index()
    {
        $data['baseUrl'] = base_url();
        $data['userName'] = $this->userName;
        $data['requestIp']  = $this->requestIp;
        $this->cismarty->view("index.tpl", $data);
    }

}
