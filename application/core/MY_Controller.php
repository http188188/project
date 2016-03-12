<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->library('session');
		$this->load->library('pagination');
		$this->cismarty->assign('baseUrl','/'.basename(FCPATH));
	}

    public function loginCheck($redirect){
        
        if(!isset($_COOKIE['C_user'])){

            $loginUrl = "http://login.intra.weibo.com?url=";
            header('Location:'.$loginUrl.base_url().$redirect);
            return false;
        }else{
            return true;
        }
    }
}
