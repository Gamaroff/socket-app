/**
 * User: gamaroff
 * Date: 2012/08/22
 * Time: 12:44 PM
 */

$(function () {

    my.CountDownTimer = function () {

        var self = this;

        var time_left = 10; //number of seconds for countdown
        var output_element_id = 'GameCountdown';

        var myCallback;

        var keep_counting = 1;
        var no_time_left_message = 'No time left for countdown!';

        self.count = function () {
            countdown();
            show_time_left();
        };

        self.timer = function () {
            self.count();

            if (keep_counting) {
                setTimeout(self.timer, 1000);
            } else {
                no_time_left();
            }
        };

        self.setTimeLeft = function (t) {
            time_left = t;
            if (keep_counting == 0) {
                self.timer();
            }
        };

        self.init = function (t, element_id, callback) {
            time_left = t;
            output_element_id = element_id;
            self.timer();
            myCallback = callback;
        };

        self.stop = function () {
            keep_counting = false;
        };

        var countdown = function () {
            if (time_left < 2) {
                keep_counting = 0;
            }

            time_left = time_left - 1;
        }

        var add_leading_zero = function (n) {
            if (n.toString().length < 2) {
                return '0' + n;
            } else {
                return n;
            }
        }

        var format_output = function () {
            var hours, minutes, seconds;
            seconds = time_left % 60;
            minutes = Math.floor(time_left / 60) % 60;
            hours = Math.floor(time_left / 3600);

            seconds = add_leading_zero(seconds);
            minutes = add_leading_zero(minutes);
            hours = add_leading_zero(hours);

            return hours + ':' + minutes + ':' + seconds;
        }

        var show_time_left = function () {
            document.getElementById(output_element_id).innerHTML = format_output();//time_left;
        }

        var no_time_left = function () {
            // document.getElementById(output_element_id).innerHTML = no_time_left_message;
            myCallback();
        }

    }

});