/* zcontroller.js 
  This file defines the main controller class for the client side of the reports app.
*/

class Controller {
  constructor(data) {
    this.document = document;

    this.dbData = [];
    this.display;

    this.getData(data);
    this.getDisplay();
  }

  /* Function retrieves Data from DB */
  getData(d) {
    d.forEach(r => { 
      for(let i in r) {
        if(r[i] == null) r[i] = "";// convert any nulls to empty strings
      }
      /* create a new 'entry' object */
      let report = new Entry(
        r.report_name.toString(),
        r.version.toString(),
        r.publish_date.toString(),
        r.request_date.toString(),
        r.requester.toString(),
        r.parameters.toString(),
        r.description.toString(),
        r.link.toString(),
        r.filters.toString(),
        r.fields.toString(),
        r.formats.toString(),
        r.category.toString(),
        r.deprecated.toString());

      this.dbData.push(report); // push into array
    });
  }

  /* Function takes form data and sends to server to create report entry */
  createNewReport(s) {
    /* Exports */
    let _formats = $('.export-choice.selected-choice'), _fstr = [];

    /* convert array to pipe delimited string */
    _formats.each(_f => { _fstr.push($(_formats[_f]).text().replace(/\s/g, ''));});
    _fstr = _fstr.join("|");

    /* Parameters */
    let _paramName = $('.param-input'), _paramDesc = $('.param-desc-input');
    let _pstr = [], _tstr = "";

    _paramName.each(_p => {
    if(_paramName[_p].value == "") return true;
    _paramDesc[_p].value != "" ? _pstr.push(_paramName[_p].value + ":" + _paramDesc[_p].value) : _pstr.push(_paramName[_p].value);
    });

    _pstr = _pstr.join('|'); // piped parameter string

    // checks if deprecated reports exist and changes deprecated status
    let _rptName = $('#new-name').val();
    s.emit('deprecate-reports', _rptName);
    
    
    /* generate data package for server */
    let _data = {
      report_name: _rptName,
      version: $('#new-version').val(),
      parameters: _pstr,
      request_date: $('#new-reqdate').val(),
      requester: $('#new-requester').val(),
      publish_date: $('#new-pubdate').val(),
      category: $('#new-category').val(),
      fields: $('#new-fields').val(),
      filters: $('#new-filters').val(),
      description: $('#new-desc').val(),
      formats: _fstr,
      link: $('#new-link').val(),
      deprecated: "N"
    };

    /* Data validation, name, version and category are required fields*/
    if(!_data.report_name) {
      $('#new-name').attr('placeholder',"*Report Name is Required*");
      $('#new-name').addClass('required-field');
    }
    if(!_data.version) {
      $('#new-version').attr('placeholder',"*Version is Required*");
      $('#new-version').addClass('required-field');
    }
    if(!_data.category) {
      $('#new-category').attr('placeholder',"*Category is Required*");
      $('#new-category').addClass('required-field');
    }

    if(_data.report_name && _data.version && _data.category) { // send to server if all required fields filled
      console.log("Generating New Report");
      s.emit('create-report', _data); // send to server
      this.reportModal(); // close modal window
    }
    else {
      console.log("Data not entered correctly");
    }

    console.log(_data);
  }

  /* Function updates Data in DB by report name/version */
  updateReport(s) {
    /* generates package */
    let _data = {
      report_name: $('#new-name').val(),
      version: $('#new-version').val(),
      parameters: $('#new-params').val(),
      request_date: $('#new-reqdate').val(),
      requester: $('#new-requester').val(),
      publish_date: $('#new-pubdate').val(),
      category: $('#new-category').val(),
      fields: $('#new-fields').val(),
      filters: $('#new-filters').val(),
      description: $('#new-desc').val(),
      exports: $('#new-exports').val(),
      link: $('#new-link').val(),
      deprecated: "N"
    };

    /* validation */
    if(!_data.report_name) {
      $('#new-name').attr('placeholder',"*Report Name is Required*");
      $('#new-name').addClass('required-field');
    }
    if(!_data.version) {
      $('#new-version').attr('placeholder',"*Version is Required*");
      $('#new-version').addClass('required-field');
    }
    if(!_data.category) {
      $('#new-category').attr('placeholder',"*Category is Required*");
      $('#new-category').addClass('required-field');
    }

    if(_data.report_name && _data.version && _data.category) {
      console.log("Generating New Report")
      s.emit('update-report', _data); // send to server and close window
      this.reportModal();
    }
    else {
      console.log("Data not entered correctly");
    }

    console.log(_data);
  }
  /* Function resets Modal to Default */
  resetModal() {
    $('#new-name').prop('disabled', false);
    $('#new-version').prop('disabled', false);
    $('#new-name').removeClass('required-field');
    $('#new-version').removeClass('required-field');
    $('#new-category').removeClass('required-field');
    $('#new-name').attr('placeholder',"Report Name");
    $('#new-version').attr('placeholder',"Version");
    $('#new-category').attr('placeholder',"Category");
    $('.export-choice').removeClass('selected-choice');

    $('#new-name').val('');
    $('#new-version').val('');
    $('#new-reqdate').val('');
    $('#new-requester').val('');
    $('#new-pubdate').val('');
    $('#new-category').val('');
    $('#new-fields').val('');
    $('#new-filters').val('');
    $('#new-desc').val('');
    $('#new-link').val('');

    for(let i = 2; i <= 5; i++) {
      $('.name-' + i).hide();
      $('.desc-' + i).hide();
    }

    $('.param-input').val('');
    $('.param-desc-input').val('');


    $('#create-rpt-submit').show();
    $('#update-rpt-submit').hide();
  }

  /* Function Creates a new Display Object based on data passed from server */
  getDisplay() {
    try {
      this.display = new Display(this.dbData);
    } catch (e) {
      console.log(e);
    }
  }

  /* Function populates report data on report viewer panel */
  reportSelect(_el) {
    let _name = _el.parents().children('.rpt-name').text().trim();
    let _ver = _el.parents().children('.rpt-ver').text();

    this.display.infoSet(_name, _ver); // sets data based on name and version
  }

  /* Function populates report viewer based on search data */
  searchSelect(_el) {
    let _data = _el.parents().children('.rpt-searcher').text();
    _data = _data.split(':');

    this.display.infoSet(_data[0], _data[1]); // set data
  }

  /* function toggles the information displayed in the advanced info section */
  advInfoChange(_el) {
    // grab current report
    let _data = _el.parents('#report-adv-info').siblings('#report-info-name');
    let _name = _data.children('#rpt-name').text().trim();
    let _ver = _data.children('#rpt-version').text().split('v.');

    // grab selected tab
    let _obj = this.display.reportFind(_name, _ver[1]);
    let _sec = _el.children().text();

    this.display.generateAdvInfo(_obj, _sec);
  }

  /* Function toggles which category to view based on selection */
  categorySelect(_el) {
    $('#table-search').hide();
    $('#limiter').show();

    let _id = _el.children().text();
    _id = _id.replace(/[ ,]+/g, "-").toLowerCase();

    if (_id == 'all-reports') {
      $('#limiter').children().show();
      $('#deprecated').hide();
    } else if(_id =='deprecated') {
      $('#limiter').children().hide();
      $('#deprecated').show();
    } else {
      $('#limiter').children().hide();
      $('#' + _id).show();
    }
  }

  /************************
    Changes Report Info Panel
  ************************/
  reportTabSwitch(_el) {
    let _val = $('#report-info-name').text() == "";
    let _text = _el[0].innerText;
    $('#report-info-container').children().hide();

    if (_text == 'Advanced Search') {
      $('#advanced-search').show();
    } else if (_text == 'Report') {
      if (_val) {
        $('#report-placeholder').show();
      } else {
        $('#report-info-main').show();
      }

    } else if (_text == 'Instructions') {
      $('#report-instructions').show();
    }

  }

  /* Function resets and hides modal if open */
  reportModal() {
    this.resetModal();
    let _obj = $('#modal-container');

    if (_obj.hasClass('hide-modal')) {
      _obj.removeClass('hide-modal');
    } else {
      _obj.addClass('hide-modal');
    }
  }

  /* Function updates data in modal based on report selection*/
  updateModal(_el) {
    let _data = _el.parents('#report-info-name');
    let report_name = _data.children('#rpt-name').text().trim();
    let version = _data.children('#rpt-version').text().split('v.')[1];
    let report = this.display.reportFind(report_name, version);
    let _obj = $('#modal-container');
    let params = report._params.split("|");
    let formats = report._formats;

    if (_obj.hasClass('hide-modal')) {
      _obj.removeClass('hide-modal');
    } else {
      _obj.addClass('hide-modal');
    }

    $.each(report, (i,v) => {
      if(v == "N/A") report[i] = "";
    });

    $('#create-rpt-submit').hide();
    $('#update-rpt-submit').show();
    $('#new-name').prop('disabled', true);
    $('#new-version').prop('disabled', true);
    $('#new-name').val(report._name);
    $('#new-version').val(report._version);
    $('#new-category').val(report._category);
    $('#new-reqdate').val(report._requestDate);
    $('#new-requester').val(report._requester);
    $('#new-pubdate').val(report._publishDate);
    $('#new-fields').val(report._field);
    $('#new-filters').val(report._filter);
    $('#new-desc').val(report._description);
    $('#new-link').val(report._link);

    $.each(params, (i,v) => {
      let tmpParam = v.split(":");
      $('.param-input.name-' + (i+1)).val(tmpParam[0]).show();
      $('.param-desc-input.desc-' + (i+1)).val(tmpParam[1]).show();
    });

    $.each(formats, (i,v) => {
      $('.export-choice.' + v.toLowerCase()).addClass('selected-choice');
    });
  }

  /* Function initiates search functionality */
  search() {
    let _text = $('.search-text').val();
    this.display.generateGlobalSearch(_text);
  }

  /* to do later sometime */
  advancedSearch() {
    console.log("Decided to skip feature, leaving blank space in case wanted at a later point");
  }

  /* Function creates additional parameter options for report in modal */
  addParameter(_el) {
    let _v = $('.param-input:visible').length + 1;

    if(_v <= 5) {
      $('#fa-changer').css('transform', 'rotate(45deg)');
      setTimeout(function(){
        $('#fa-changer').css('transform', 'rotate(90deg)');
      }, 500);

      $('.name-' + _v).show();
      $('.desc-' + _v).show();
    } else {
      console.log("Max Params");
    }
  }

  /* not finished */
  tableSort(_el) {
    let _f = _el.text();
    if(_f == 'Report Name')
      _f = '_name';
    if(_f == 'Version')
      _f = '_version';
    if(_f == 'Parameters')
      _f = '_params';
    if(_f == 'Request Date')
      _f = '_requestDate';
    if(_f == 'Requester')
      _f = '_requester';
    if(_f == 'Publish Date')
      _f = '_publishDate';
  }
}
