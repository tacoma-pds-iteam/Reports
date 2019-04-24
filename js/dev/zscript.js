/* zscript.js initializes all object handlers for client including socket object and the main driver. */
(_ => { // on page load

  /* init socket */
  var socket = io({
      reconnection: false,
      reconnectionAttempts: 1,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
  });

  $('body').on('click', '.adv-info-btn', function(e) { // when advanced report info tab is clicked
    main.controller.advInfoChange($(this));
  });

  $('body').on('click', '.rpt-click',function(e) { // when report list item is clicked
    main.controller.reportSelect($(this));
  });
  $('body').on('click', '.fa-edit',function(e) { // when edit icon is clicked
    main.controller.updateModal($(this));
  });

  $('body').on('click', '.menu-option',function(e) { // when category is selected
    main.controller.categorySelect($(this));
  });

  $('.report-modal').click(function(e) { // when new report button is clickec
    main.controller.reportModal();
  });

  $('.search-text').keyup(function(e) { // when search text entered
      main.controller.search();
  });

  $('#create-rpt-submit').click(function(e) { // when submit button is clicked on new report modal
    main.controller.createNewReport(socket);
  });

  $('#update-rpt-submit').click(function(e) { // when update button is clicked on  update report modal
    main.controller.updateReport(socket);
  });

  $('body').on('click', '.search-title', function(e) { // when search entry is selected
    main.controller.searchSelect($(this));
  });

  $('.reload-page').click(function(e) { // click reports header to reload page
    location.reload();
  });

  $('body').on('click', '#new-param-button', function(e) { // adds new parameter entry fields
    main.controller.addParameter($(this));
  });

  $('.export-choice').click(function(e) { //toggle export
    $(this).toggleClass('selected-choice');
  });

  $('body').on('click', '.table-cat-sort', function(e) { // sort table *unfinished*
    main.controller.tableSort($(this));
  });

  /* Easter Egg */
  $('.easter-egg').click(function(e) {
    if(!$('body').hasClass('haha')) $('body').rotate(180);
    else $('body').rotate(0);
    $('body').toggleClass('haha');
  });

  const main = new Main(socket); // instantiate main class
})();

/* rotate easter egg */
jQuery.fn.rotate = function(rot) {
  let context = this;
   $(context).css({
          '-webkit-transform' : 'rotate('+rot+'deg)',
          '-moz-transform' : 'rotate('+rot+'deg)',
          '-ms-transform' : 'rotate('+rot+'deg)',
          'transform' : 'rotate('+rot+'deg)'
      });
   if(rot == 0) {
    $(context).css('margin-top', '0px');
  } else {
    $(context).css('margin-top', '-60px');
  }    
};
