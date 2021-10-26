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

  