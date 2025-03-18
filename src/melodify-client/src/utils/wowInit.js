import WOW from 'wowjs';
import 'animate.css';

export const initWow = () => {
  const wow = new WOW.WOW({
    boxClass: 'wow',        // tên class mặc định
    animateClass: 'animated', // tên class animation
    offset: 50,             // khoảng cách element với màn hình (px)
    mobile: true,           // bật animation trên mobile
    live: false,            // bật chế độ live
    callback: function(box) {
      // callback khi element được animate
    },
    scrollContainer: null   // optional scroll container selector
  });
  wow.init();
};