let selectEditTab = function (evt, tabID) {

  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  tabcontents = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }

  evt.currentTarget.className += " active";
  document.getElementById(tabID).style.display = "block";
}

var cur_floating_icon;

let clickEditElement = function (evt, target_id) {
  cur_floating_icon = document.getElementById(target_id);
  cur_floating_icon.style.display = "block";
  cur_floating_icon.style.left = (evt.clientX + 10) + "px";
  cur_floating_icon.style.top = (evt.clientY + 10) + "px";
}

$(".panel").mousemove(function (e) {
  if(!cur_floating_icon){
    return
  }
  cur_floating_icon.style.left = (e.clientX + 10) + "px";
  cur_floating_icon.style.top = (e.clientY + 10) + "px";
});

$("#panel-timeline").mousedown(function (e) {
  cur_floating_icon.style.display = "none";
  cur_floating_icon = null;
});