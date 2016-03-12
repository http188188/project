<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <head>  
    <!--载入完整的CKEditor执行代码-->  
    <script type="text/javascript" src="<%$baseUrl%>/js/ckeditor/ckeditor.js"></script>
    <script type="text/javascript" src="<%$baseUrl%>/js/ckfinder/ckfinder.js"></script>
  </head> 
  <body>
  <form id="Form" action="<%$baseUrl%>/test/testadd" method="post" accept-charset="utf-8">
    <textarea name="ckeditor" class="ckeditor">my Test</textarea>
    <input type="submit" name="ButtonName" value="提交" />
  </body>
  <script type="text/javascript">
  	CKEDITOR.replace( 'ckeditor');
  </script>
</html>