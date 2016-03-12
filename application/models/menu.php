<?php
header("Content-Type: text/html;charset=utf-8");

class Menu extends CI_Model
{
	function __construct() {
		parent::__construct();
	}

	function getMenu()
	{
	    return $this->db->select('name,url,icon,permission')->from('menu')->order_by('id')
	           ->get()->result_array();
	}
}