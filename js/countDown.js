function CountDown(deadline, $ele) {
    this.count(deadline, $ele);
}

CountDown.prototype = {
    count: function (deadline, $ele) {
        var now = new Date().getTime();
        this.$ele = $ele;
        var me = this;
        if (deadline.getTime() - now <= 0) {
            clearInterval(this.interval);
            $ele.find('.hour').text('00');
            $ele.find('.minite').text('00');
            $ele.find('.second').text('00');
        }
        else {
            this.init(deadline);
            this.interval = setInterval(function () {
                me.init(deadline)
            }, 1000);
        }
    },

    init: function (deadline) {
        var now = new Date().getTime();
        if (deadline - now <= 0) {
            clearInterval(this.interval);
            this.$ele.find('.hour').text('00');
            this.$ele.find('.minite').text('00');
            this.$ele.find('.second').text('00');
        }
        else {
            this.getNum(deadline);
        }
    },

    getNum: function (deadline) {
        var now = new Date().getTime();
        var time = deadline.getTime() - now;
        var hour = this.formatNum(Math.floor(time / 1000 / 60 / 60 % 24));
        var minite = this.formatNum(Math.floor(time / 1000 / 60 % 60));
        var second = this.formatNum(Math.floor(time / 1000 % 60));
        this.$ele.find('.hour').text(hour);
        this.$ele.find('.minite').text(minite);
        this.$ele.find('.second').text(second);
    },

    formatNum: function (num) {
        return num >= 10 ? num : '0' + num;
    }
};

module.exports = CountDown;