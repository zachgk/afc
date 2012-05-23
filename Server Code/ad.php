<?php 
if( ($charity = $_GET["charity"]) && intval($charity) && $_GET["number"] <= 5){
  $mysqli = new mysqli("localhost", "zachki5_drplafc", "2weeks", "zachki5_drplafc");
  $add_view_query = "UPDATE dr_field_data_field_charity_views SET field_charity_views_value=field_charity_views_value+".$_GET["number"]." WHERE entity_id=$charity";
  $mysqli->query($add_view_query);
}
?>