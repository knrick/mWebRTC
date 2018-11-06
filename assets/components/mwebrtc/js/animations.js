/*
    All style related is here
*/
// add the animation to the modal
$(".modal").each(function (index) {
    $(this).on('show.bs.modal', function (e) {
        var open = $(this).attr('data-easein');
        if (open == 'shake') {
            $('.modal-dialog').velocity('callout.' + open);
        } else if (open == 'pulse') {
            $('.modal-dialog').velocity('callout.' + open);
        } else if (open == 'tada') {
            $('.modal-dialog').velocity('callout.' + open);
        } else if (open == 'flash') {
            $('.modal-dialog').velocity('callout.' + open);
        } else if (open == 'bounce') {
            $('.modal-dialog').velocity('callout.' + open);
        } else if (open == 'swing') {
            $('.modal-dialog').velocity('callout.' + open);
        } else {
            $('.modal-dialog').velocity('transition.' + open);
        }
    });
});

 $('.mWebRTC').on('shown.bs.modal', function() {
    $('.btn-animation-1').fadeOut( "fast" );
 })
 
$('.mWebRTC').on('hidden.bs.modal', function() {
    $('.btn-animation-1').fadeIn( "slow" ) 
})