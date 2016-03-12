/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.width  = '1000px';
	config.height = '300px';
	config.filebrowserBrowseUrl      = '/Immigration/js/ckfinder/ckfinder.html';
    config.filebrowserImageBrowseUrl = '/Immigration/js/ckfinder/ckfinder.html?Type=Images';
    config.filebrowserFlashBrowseUrl = '/Immigration/js/ckfinder/ckfinder.html?Type=Flash';
    config.filebrowserUploadUrl      = '/Immigration/js/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files';
    config.filebrowserImageUploadUrl = '/Immigration/js/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';
    config.filebrowserFlashUploadUrl = '/Immigration/js/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash';
};