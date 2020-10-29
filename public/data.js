$(document).ready(function () {
  setInterval(stopEvents, 200);
  $("#data").focus();
});

function stopEvents() {
  if ($("#data").is(":focus") == true) {
    $(document).keydown(function (e) {
      if (e.which == 17 || e.which == 74 || e.keyCode == 13) {
        e.preventDefault();
      }
    });
  }
}
