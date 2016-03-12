<?php
header("Content-Type: text/html;charset=utf-8");

class Test extends MY_Controller{

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

    public function sync(){
        passthru('/bin/bash /home/www/default/sync.sh');
    }

    public function home()
    {
        $data_array = array('name' => 'This is a test', 'baseUrl' => base_url() );
        $this->cismarty->view('test.tpl',$data_array);
    }

    public function testadd()
    {
        var_dump($this->input->post());
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
        $this->cismarty->view("home.tpl", $data);
    }

    public function getMenuList()
    {
        $this->load->model('menu');
        $menuList = $this->menu->getMenu();
        echo Json_encode($this->permissionFilter($menuList, $this->userName));
    }

    public function getAdminList()
    {
        $this->load->model('adminlist');
        echo Json_encode($this->adminlist->getAdminList());
    }

    public function permissionFilter($allMenu, $user){
        $this->load->model('adminlist');
        $adminListObj = $this->adminlist->getAdminList();
        foreach ($adminListObj as $value) {
            if($value['name'] == $user){
                return $allMenu;
            }   
        }   
        $permissionedMenu = array();
        foreach($allMenu as $value){
            if($value['permission'] == 1){ 
                array_push($permissionedMenu, $value);
            }
        }   
        return $permissionedMenu;
    }

    public function updateAdminPermission(){
        $this->load->model('adminlist');
        echo json_encode(($this->adminlist->updateAdminUser($this->input->post())));
    }

    public function addAdminPermission(){
        $this->load->model('adminlist');
        echo json_encode($this->adminlist->addAdminUser($this->input->post()));
    }

    public function deleteAdminPermission(){
        $this->load->model('adminlist');
        echo json_encode($this->adminlist->deleteAdminUser($this->input->post('id')));
    }

    public function getFolderFile(){
        $this->load->helper('directory');
        echo Json_encode(directory_map('js/pages/wiki'));
    }

    public function getFileContent($type, $fileName){
        $content = file_get_contents('js/pages/wiki/'.$type.'/'.$fileName.'.html');
        preg_match('/<title>(.*?)<\/title>/',$content, $result);
        echo $result[1];
    }
}
