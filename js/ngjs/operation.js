$(function($){
    $('.list-group a').click(function(e) {
        $('.list-group a').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
        e.preventDefault();
    });
});
