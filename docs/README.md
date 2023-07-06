<!-- 运行时间统计 -->
  <!-- <script language=javascript>
    // window.onload = function(){
    //   siteTime();
    // }
    function siteTime() {
      window.setTimeout("siteTime()", 1000);
      var seconds = 1000;
      var minutes = seconds * 60;
      var hours = minutes * 60;
      var days = hours * 24;
      var years = days * 365;
      var today = new Date();
      var todayYear = today.getFullYear();
      var todayMonth = today.getMonth() + 1;
      var todayDate = today.getDate();
      var todayHour = today.getHours();
      var todayMinute = today.getMinutes();
      var todaySecond = today.getSeconds();
      // Date.UTC() -- 返回date对象距世界标准时间(UTC)1970年1月1日午夜之间的毫秒数(时间戳)
      // year - 作为date对象的年份，为4位年份值
      // month - 0-11之间的整数，做为date对象的月份
      // day - 1-31之间的整数，做为date对象的天数
      // hours - 0(午夜24点)-23之间的整数，做为date对象的小时数
      // minutes - 0-59之间的整数，做为date对象的分钟数
      // seconds - 0-59之间的整数，做为date对象的秒数
      // microseconds - 0-999之间的整数，做为date对象的毫秒数
      var t1 = Date.UTC(2022, 10, 4, 00, 00, 00); //2022-10-4 00:00:00
      var t2 = Date.UTC(todayYear, todayMonth, todayDate, todayHour, todayMinute, todaySecond);
      var diff = t2 - t1;
      var diffYears = Math.floor(diff / years);
      var diffDays = Math.floor((diff / days) - diffYears * 365);
      var diffHours = Math.floor((diff - (diffYears * 365 + diffDays) * days) / hours);
      var diffMinutes = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours) / minutes);
      var diffSeconds = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours - diffMinutes * minutes) / seconds);
      document.getElementById("sitetime").innerHTML = " 本网站已运行 " + diffYears + " 年 " + diffDays + " 天 " + diffHours + " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒 ";
    }siteTime();
  </script> -->

## 飞跃手册-川师大[Sicnu.wiki](https://www.sicnu.wiki)

## 公告

- **飞跃手册 - 川师**于2022年10月4日开始编制，本项目的初衷是为川师学子提供一个经验交流，分享的平台，希望能够帮助到更多的人，诚挚的邀请大家的加入！
- 域名已注册为：[sicnu.wiki](https://sicnu.wiki),请牢记哦！

## 投稿/修改

- 愿意分享经验的小伙伴们请将稿件投递至邮箱sicnu_wiki@126.com，欢迎广大学子的加入！

## 意见/改进

- 【腾讯文档】飞跃手册意见征集表 -i（待创建

## 近期更新
- 2022.11.14-域名已注册为：[sicnu.wiki](https://sicnu.wiki)
## 飞跃手册-川师 是什么？
编者按：
>首先感谢小伙伴们阅读飞跃手册。<br>
>早在2015年，上海交大的学生们发起了一项《上海交大生存手册》，其后身为《交大飞跃手册》，后来又陆续出现了《南科大飞跃手册》，《海南大学飞跃手册》，《南京工业大学飞跃手册》等。受此些项目的启发，结合编者自身所经历的学习环境，创建《飞跃手册-川师大》。该项目希望为川师学子，广大学生们提供一个总结经验、交流经验的平台。
## 如何分享经验？
飞跃手册欢迎**所有的毕业生**分享你们的故事，不限水平、不限出路。

1. 对于没有Git使用背景的大部分同学：请将编辑好的`Word`/`Pages`/`Markdown`文件发送到sicnu_wiki@126.com，我们会帮助你上架。
2. 对于熟悉Git操作的同学：请对[docs](https://github.com/SICNU-Application/wiki-SICNU/tree/master/docs)路径下的对应文件夹Pull Request，可参考 [《如何进行经验分享》](https://github.com/SICNU-Application/wiki-SICNU/blob/master/docs/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8GitHub%E8%BF%9B%E8%A1%8C%E7%BB%8F%E9%AA%8C%E5%88%86%E4%BA%AB.md)，Merge后便即时上线。
3. 如需更新内容，请及时联系我们！


## 友情链接
[南方科技大学飞跃手册](https://sustech-application.com/#/?id=%e5%8d%97%e6%96%b9%e7%a7%91%e6%8a%80%e5%a4%a7%e5%ad%a6%e9%a3%9e%e8%b7%83%e6%89%8b%e5%86%8c)

[安徽大学飞跃手册](https://www.ahu.wiki/#/)

[上海交通大学飞跃手册](https://survivesjtu.github.io/SJTU-Application/#/)

[南京工业大学飞跃手册](https://github.com/yaoshun123/FLY_NJTech)

[一亩三分地--北美申请论坛](http://www.1point3acres.com/)

<br>

<!-- <span id="sitetime"></span><br> -->
<span>Copyright©2022-present.</span>
<span>[Powered by docsify.](https://github.com/docsifyjs/docsify)</span>
<br>


!> 移动端访问请点击`左下角菜单栏`展开菜单，祝阅读愉快！
<br>
<!-- `手册搭建：https://www.ahu.wiki/#/%E4%BB%8E0%E5%88%B01%E5%88%9B%E5%BB%BA%E5%AE%89%E5%BE%BD%E5%A4%A7%E5%AD%A6%E9%A3%9E%E8%B7%83%E6%89%8B%E5%86%8C` -->

<!-- ## 贡献者 -->
<!-- https://contrib.rocks/preview?repo=angular%2Fangular-ja 
Generate an image of contributors to keep your README.md in sync.
-->
<!-- <a href="https://github.com/orgs/SICNU-Application/people">
  <br><img src="https://contributors-img.web.app/image?repo=SUSTech-Application/SUSTechapplication" />
</a> -->
