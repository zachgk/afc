<script type="text/javascript">
   (function(){function pw_load(){
      if(arguments.callee.z)return;else arguments.callee.z=true;
      var d=document;var s=d.createElement('script');
      var x=d.getElementsByTagName('script')[0];
      s.type='text/javascript';s.async=true;
      s.src='//www.projectwonderful.com/pwa.js';
      x.parentNode.insertBefore(s,x);}
   if (window.attachEvent){
    window.attachEvent('DOMContentLoaded',pw_load);
    window.attachEvent('onload',pw_load);}
   else{
    window.addEventListener('DOMContentLoaded',pw_load,false);
    window.addEventListener('load',pw_load,false);}})();
</script>

<?php 
switch($_GET["ad_number"]) {
	case 1:
		print '<div id="pw_adbox_60904_4_0"></div>';
		break;
	case 2:
		print '<div id="pw_adbox_63814_4_0"></div>';
		break;	
	case 3:
		print '<div id="pw_adbox_60904_4_0"></div>';
		break;
	case 4:
		print '<div id="pw_adbox_63814_4_0"></div>';
		break;
	case 5:
		print '<div id="pw_adbox_63814_4_0"></div>';
		break;
}

if($charity = $_GET["charity"]){
  $add_view_query = "UPDATE dr_field_data_field_charity_views SET field_charity_views_value=field_charity_views_value+1 WHERE entity_id=$charity";
  //$add_view_result = mysqli_query(/*database connect variable*/,$add_view_query);
  //Should I be changing dr_field_revision_field_charity_views instead?
}

 ?>