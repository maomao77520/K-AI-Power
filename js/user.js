var css = require('../css/user.scss');

$(document).ready(function () {
    $.ajax({
        url: '/charger/getUserProfile',
        type: 'POST',
        data: JSON.stringify({
            accessToken: 'asdasdwedf565665'
        }),
        contentType: 'application/json',
        success: function (res) {
            if (res.status == 0) {
                $('.user-name').text(res.data.nickname);
                $('.user-icon').css({
                    'background-image': 'url(' + res.data.avatar + ')'
                })
            }
        }
    });
    
});