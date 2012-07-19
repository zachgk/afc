function pw_gQS(a) {
  var c = window.location.search.substring(1);
  var d = c.split("&");
  for (var b = 0; b < d.length; b++) {
    var e = d[b].split("=");
    if (e[0] == a) {
      return e[1]
    }
  }
  return ""
}
var els = document.getElementsByTagName("div");
var i = els.length;
while (i--) {
  var pw_s;
  var pw_a;
  pw_s = els[i].id.substring(0, 9);
  if (pw_s == "pw_adbox_") {
    pw_a = (els[i].id).split("_");
    var projectwonderful_adbox_id = pw_a[2];
    var projectwonderful_adbox_type = pw_a[3];
    var pw_d = document;
    var pw_r = new String(Math.random() * 9999);
    var pw_s = new String();
    pw_r = pw_r.substr(0, 5);
    var pw_hl = (pw_gQS("pw_highlight_code"));
    var pw_reg = (pw_gQS("pw_region_display"));
    pw_s += "https";
    pw_s += "://projectwonderful.com/gen_async.php";
    pw_s += "?id=" + projectwonderful_adbox_id + "&type=" + projectwonderful_adbox_type;
    pw_s += "&r=" + pw_r;
    if (pw_d.referrer) {
      pw_s += "&referer=" + escape(pw_d.referrer)
    }
    if (pw_d.location) {
      pw_s += "&location=" + escape(pw_d.location)
    }
    if (pw_d.projectwonderful_foreground_color) {
      pw_s += "&fg=" + escape(pw_d.projectwonderful_foreground_color)
    }
    if (pw_d.projectwonderful_background_color) {
      pw_s += "&bg=" + escape(pw_d.projectwonderful_background_color)
    }
    if (pw_hl != "") {
      pw_s += "&hl=" + escape(pw_hl.match(/[0-9]+/g))
    }
    if (pw_reg != "") {
      pw_s += "&reg=" + escape(pw_reg.match(/[0-9]+/g))
    }
    var pw_adloader = document.createElement("script");
    pw_adloader.src = pw_s;
    (pw_d.getElementsByTagName("head")[0] || pw_d.getElementsByTagName("body")[0]).appendChild(pw_adloader)
  }
};