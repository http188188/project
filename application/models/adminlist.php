<?php
header("Content-Type: text/html;charset=utf-8");

class Adminlist extends CI_Model
{
    function __construct() {
        parent::__construct();
    }

    function getAdminList(){   
        return $this->db->select('id,name,group')->from('adminlist')->order_by('id')
               ->get()->result_array();
    }

    function updateAdminUser($postData){
        $this->db->where('id',$postData['id']);
        return $this->db->update('adminlist', $postData);
    }

    function addAdminUser($addedUser){
        $this->db->insert('adminlist', $addedUser);
        $returnedId = $this->db->select('max(id) as id')->from('adminlist')->get()->result_array();
        return $returnedId[0]['id'];
    }

    function deleteAdminUser($deleteUserId){
        return $this->db->delete('adminlist', array('id' => $deleteUserId)); 
    }
}