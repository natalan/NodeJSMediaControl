/**
 * Created by zharau on 7/31/14.
 */
$(function() {
    var $modal = $("#IRCodeModal"),
        $code = $modal.find('.modal-body textarea'),
        $alertSuccess = $('.alert-success'),
        $alertError = $('.alert-danger'),
        $alertInfo = $('.alert-info');

    $modal.find('.copy-code').click(function(){
        $code.select();
    });

    var _learn = function () {
        $code.text('waiting for the signal...');
        $.post('/api/blaster/learn').done(function(code) {
            $code.text(JSON.stringify(code, null, '\t'));
        });
    };

    $('.learn-code').on('click', function(e) {
        e.preventDefault();
        $modal.modal();
        _learn();
    });

    $('.another').on('click', function(e) {
        e.preventDefault();
        _learn();
    });


    $('.commands').on('click', 'button', function(e) {
        e.preventDefault();
        var body = {
            device: $(this).data("device"),
            command: $(this).data("command")
        };
        $alertInfo.removeClass('hidden').text('Sending '+ body.command + ' to ' + body.device);
        $.post("/api/blaster/send", body).done(function() {
            $alertInfo.addClass('hidden');
            $alertSuccess.removeClass('hidden').text("Successfully send command to the device");
            setTimeout(function() {
                $alertSuccess.addClass('hidden');
            }, 5000);
        }).fail(function() {
            $alertInfo.addClass('hidden');
            $alertError.removeClass('hidden').text("Error sending command to the device");
            setTimeout(function() {
                $alertError.addClass('hidden');
            }, 5000);
        });
    });
});