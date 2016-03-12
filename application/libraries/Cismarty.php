<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require_once( 'Smarty/Smarty.class.php' );
 
class Cismarty extends Smarty
{
  // var $CI;
 
  public function __construct()
  {   
    parent::__construct();

    // $this->CI =& get_instance();
    $config = & get_config();

    $this->template_dir = APPPATH.'views/';
    $this->compile_dir  = APPPATH.'templates_c/';
    $this->cache_dir    = FCPATH.'cache/';
    $this->left_delimiter = '<%';
    $this->right_delimiter = '%>';

  }   

  function view( $template, $data = array() )
  {   
    foreach ($data as $key => $val)
    {   
      $this->assign($key, $val);
    }   
    $this->display($template); 
  }   
 
 }
