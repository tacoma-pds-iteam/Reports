'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Display = function () {
  function Display(dataObj) {
    _classCallCheck(this, Display);

    this.tableObj = dataObj;
    this.generation(this.tableObj);
  }

  _createClass(Display, [{
    key: 'infoSet',
    value: function infoSet(_t, _v) {
      $('#report-info-container').children().hide();
      $('#report-info-main').show();

      var _data = this.reportFind(_t, _v);

      this.generateInfo(_data);
      this.generateAdvInfo(_data, "Parameters");
    }

    /*********************************************************
      Helper function to find specific report for information panel
    *********************************************************/

  }, {
    key: 'reportFind',
    value: function reportFind(_t, _v) {
      var _data = void 0;
      var _obj = this.tableObj;
      if (_obj) {
        for (var i = 0; i < _obj.length; i++) {
          if (_t == _obj[i]._name && _v == _obj[i]._version) {
            _data = _obj[i];
          }
        }
      }

      return _data;
    }

    /*********************************************************
      Master function to call all generation
    *********************************************************/

  }, {
    key: 'generation',
    value: function generation(_obj) {
      var _cat = this.getCategories(_obj);

      this.generateMenu(_cat);
      this.generateTable(_cat, _obj);
    }

    /*********************************************************
      Helper function to get categories
    *********************************************************/

  }, {
    key: 'getCategories',
    value: function getCategories(_obj) {
      var _cat = [];
      if (_obj) {
        for (var i = 0; i < _obj.length; i++) {
          if (_cat.includes(_obj[i]._categories[0]) == false) {
            _cat.push(_obj[i]._categories[0]);
          }
        }
      }

      _cat.sort();
      return _cat;
    }

    /*********************************************************
      Generates dynamic category select menu
    *********************************************************/

  }, {
    key: 'generateMenu',
    value: function generateMenu(_cat) {
      var _choices = '\n      <div class=\'menu-option\'>\n        <p>All Reports</p>\n      </div>';

      if (_cat) {
        for (var i = 0; i < _cat.length; i++) {
          _choices += '\n          <div class=\'menu-option\'>\n            <p>' + _cat[i] + '</p>\n          </div>';
        }
      }

      _choices += '\n      <div class=\'menu-option\'>\n        <p>Deprecated</p>\n      </div>';

      $("#menu-choices").html(_choices);
    }

    /*********************************************************
      Generates the entire report table
    *********************************************************/

  }, {
    key: 'generateTable',
    value: function generateTable(_cat, _obj) {
      _obj.sort(this.sorter('_publishDate'));
      var _table = "";
      var _id = void 0;

      if (_cat) {
        for (var i = 0; i < _cat.length; i++) {
          _id = _cat[i].replace(/[ ,]+/g, "-").toLowerCase();
          _table += '\n          <div id=\'' + _id + '\'>\n          <div class=\'table-header\'>\n            ' + _cat[i] + '\n          </div>\n          <div class=\'table-content\'>\n            <table>\n              <thead>\n                <tr>\n                  <th width=\'30%\'><div style=\'text-align:left\' class=\'table-cat-sort\'>Report Name</div></th>\n                  <th class=\'table-cat-sort\'>Version</th>\n                  <th class=\'table-cat-sort\'>Parameters</th>\n                  <th class=\'table-cat-sort\'>Request Date</th>\n                  <th class=\'table-cat-sort\'>Requester</th>\n                  <th class=\'table-cat-sort\'>Publish Date</th>\n                  <th width=\'10%\' ><div style=\'text-align:center\'>Link</div></th>\n                </tr>\n              </thead>\n              <tbody>';

          if (_obj) {
            for (var k = 0; k < _obj.length; k++) {
              if (_cat[i] == _obj[k]._categories[0] && _obj[k]._deprecated == "N") {
                _table += '\n              <tr class=\'table-rpt-option\'>\n                <td class=\'rpt-click rpt-name\'><div style=\'text-align:left\'>' + _obj[k]._name + '</div></td>\n                <td class=\'rpt-click rpt-ver\'>' + _obj[k]._version + '</td>\n                <td class=\'rpt-click\'>' + _obj[k]._paramsCount + '</td>\n                <td class=\'rpt-click\'>' + _obj[k]._requestDate + '</td>\n                <td class=\'rpt-click\'>' + _obj[k]._requester + '</td>\n                <td class=\'rpt-click\'>' + _obj[k]._publishDate + '</td>\n                <td><button type=\'button\' class=\'rpt-link\' onclick="window.open(\'' + _obj[k]._link + '\')"><i class="fas fa-link"></i></button></td>\n              </tr>\n              ';
              }
            }
          }
          _table += '\n                </tbody>\n              </table>\n            </div>\n          </div>\n          </div>';
        }

        _table += '\n      <div id=\'deprecated\'>\n      <div class=\'table-header\'>\n        Deprecated\n      </div>\n      <div class=\'table-content\'>\n        <table>\n          <thead>\n            <tr>\n              <th width=\'30%\'><div style=\'text-align:left\'>Report Name</div></th>\n              <th width=\'\'>Version</th>\n              <th width=\'\'>Parameters</th>\n              <th width=\'\'>Request Date</th>\n              <th width=\'\'>Requester</th>\n              <th width=\'\'>Publish Date</th>\n              <th width=\'10%\' ><div style=\'text-align:center\'>Link</div></th>\n            </tr>\n          </thead>\n          <tbody>';

        if (_obj) {
          for (var _k = 0; _k < _obj.length; _k++) {
            if (_obj[_k]._deprecated == "Y") {
              _table += '\n            <tr class=\'table-rpt-option\'>\n              <td class=\'rpt-click rpt-name\'><div style=\'text-align:left\'>' + _obj[_k]._name + '</div></td>\n              <td class=\'rpt-click rpt-ver\'>' + _obj[_k]._version + '</td>\n              <td class=\'rpt-click\'>' + _obj[_k]._paramsCount + '</td>\n              <td class=\'rpt-click\'>' + _obj[_k]._requestDate + '</td>\n              <td class=\'rpt-click\'>' + _obj[_k]._requester + '</td>\n              <td class=\'rpt-click\'>' + _obj[_k]._publishDate + '</td>\n              <td><button type=\'button\' class=\'rpt-link\' onclick="window.open(\'' + _obj[_k]._link + '\')"><i class="fas fa-link"></i></button></td>\n            </tr>\n            ';
            }
          }
        }
        _table += '\n              </tbody>\n            </table>\n          </div>\n        </div>';
      }

      $('#table-search').hide();
      $("#limiter").html(_table);
      $('#deprecated').hide();
    }

    /*********************************************************
      Generates general information on report panel
    *********************************************************/

  }, {
    key: 'generateInfo',
    value: function generateInfo(_obj) {
      // Required Fields
      var _name = _obj._name;
      var _version = _obj._version;
      var _categories = _obj._categories;

      // Additional Fields
      var _pubDate = _obj._publishDate != '' ? _obj._publishDate : 'Not Available';
      var _reqDate = _obj._requestDate != '' ? _obj._requestDate : 'Not Available';
      var _requester = _obj._requester != '' ? _obj._requester : 'Not Available';
      var _desc = _obj._description != 'N/A' ? _obj._description : 'No Description Available';
      var _link = _obj._link;
      var _formats = _obj._formats;

      var _title = '\n      <span id="rpt-name"><i class="fas fa-edit"></i> ' + _name + '</span>\n      <span id="rpt-version">v.' + _version + '</span>';

      // Base Info
      $("#report-info-name").html(_title);
      $("#report-publish-date").html(_pubDate);
      $("#report-request-date").html(_reqDate);
      $("#report-requester").html(_requester);
      $("#report-categories").html(_categories.join(', '));
      $("#report-description").html(_desc);

      // Links
      var _linkHTML = '<h3>Report Links:</h3><a href=\'' + _link + '\' target=\'_blank\'>Direct Link</a>';
      var _addFormat = 0;
      var _addLink = void 0;

      if (_formats) {
        for (var i = 0; i < _formats.length; i++) {
          if (_formats[i] == 'CSV') {
            _addFormat = '8';
          } else if (_formats[i] == 'PDF') {
            _addFormat = '5';
          } else if (_formats[i] == 'Excel') {
            _addFormat = '6';
          }

          _addLink = _link + '&export=true&exporttype=';
          _addLink += _addFormat;
          _linkHTML += '<a href=\'' + _addLink + '\' target=\'_blank\'>' + _formats[i] + '</a>';
        }
      }

      $("#report-links").html(_linkHTML);
    }

    /*********************************************************
      Generates adv info on bottom of report panel
    *********************************************************/

  }, {
    key: 'generateAdvInfo',
    value: function generateAdvInfo(_obj, _section) {
      var _advInfo = "";
      if (_section == "Parameters") {
        this.AdvInfoButtonToggle(0);
        var _params = _obj._paramsSplit,
            _paramsDesc = [];
        for (var p in _params) {
          var pSplit = _params[p].split(':');
          if (pSplit.length > 1) {
            _params[p] = pSplit[0];
            _paramsDesc.push(pSplit[1]);
          }
        }

        if (_params) {
          for (var i = 0; i < _params.length; i++) {
            if (_params[i] != "N/A") {
              _advInfo += '<tr><td width=\'50%\'>' + _params[i] + '</td><td width=\'50%\'>';

              if (_paramsDesc[i] && _paramsDesc.length <= i + 1) {
                _advInfo += '' + _paramsDesc[i];
              } else {
                _advInfo += 'N/A';
              }

              _advInfo += '</td></tr>';
            } else {
              _advInfo = '<tr><td>No Input Parameters</td></tr>';
            }
          }
        } else {
          _advInfo = '<tr><td>No Input Parameters</td></tr>';
        }
      }
      if (_section == "Fields") {
        this.AdvInfoButtonToggle(1);
        var _fields = _obj._fields;

        if (_fields) {
          for (var _i = 0; _i < _fields.length; _i++) {
            if (_fields[_i] != "N/A") {
              _advInfo += '<tr><td>' + _fields[_i] + '</td></tr>';
            } else {
              _advInfo = '<tr><td>No Fields Indicated</td></tr>';
            }
          }
        } else {
          _advInfo = '<tr><td>No Fields Indicated</td></tr>';
        }
      }
      if (_section == "Filters") {
        this.AdvInfoButtonToggle(2);
        var _filters = _obj._filters;

        if (_filters) {
          for (var _i2 = 0; _i2 < _filters.length; _i2++) {
            if (_filters[_i2] != "N/A") {
              _advInfo += '<tr><td>' + _filters[_i2] + '</td></tr>';
            } else {
              _advInfo = '<tr><td>No Filters on report</td></tr>';
            }
          }
        } else {
          _advInfo = '<tr><td>No Filters on report</td></tr>';
        }
      }
      $("#report-adv-generation").html(_advInfo);
    }

    /*********************************************************
      Search html creation
    *********************************************************/

  }, {
    key: 'generateGlobalSearch',
    value: function generateGlobalSearch(_text) {
      var _obj = this.tableObj;
      var _search = void 0;
      var _curItem = void 0;
      var _items = [];
      var _name = void 0,
          _version = void 0,
          _description = void 0,
          _requester = void 0,
          _holder = void 0;
      var _counter = 0;

      if (_text) {
        _search = _text.toLowerCase().toString();
      } else {
        _search = null;
      }

      for (var i = 0; i < _obj.length; i++) {
        _holder = [_obj[i]._name, _obj[i]._version, _obj[i]._description, _obj[i]._requester];
        if (_holder[0].toLowerCase().indexOf(_search) !== -1) {
          _items.push(_holder);
        } else if (_holder[1].toLowerCase().indexOf(_search) !== -1) {
          _items.push(_holder);
        } else if (_holder[2].toLowerCase().indexOf(_search) !== -1) {
          _items.push(_holder);
        } else if (_holder[3].toLowerCase().indexOf(_search) !== -1) {
          _items.push(_holder);
        }
      }

      if (_items.length > 0) {
        _counter = _items.length;
      }

      var _table = '\n      <div class=\'table-header\'>\n        ' + _counter + ' search results\n      </div>\n      <div id=\'search-results-container\'>';

      if (_items.length > 0) {
        for (var _i3 = 0; _i3 < _items.length; _i3++) {
          _table += '\n          <div class=\'search-result\'>\n            <span class=\'rpt-searcher\'>' + _items[_i3][0] + ':' + _items[_i3][1] + '</span>\n            <div class=\'search-title\'>' + (_i3 + 1) + '. ' + _items[_i3][0] + '</div>\n            <div><b>Version:</b> ' + _items[_i3][1] + '</div>\n            <div><b>Requester:</b> ' + _items[_i3][3] + '</div>\n            <div><b>Description:</b><br> ' + _items[_i3][2] + '</div>\n          </div>\n          ';
        }
      }

      _table += '</div>';

      $('#limiter').hide();
      $('#table-search').show();
      $('#table-search').html(_table);
    }

    /*********************************************************
      Quick function for toggling adv info button
    *********************************************************/

  }, {
    key: 'AdvInfoButtonToggle',
    value: function AdvInfoButtonToggle(_b) {
      $("#report-info-label").children(".adv-info-btn").removeClass('active-tab');
      $("#report-info-label").children(".adv-info-btn")[_b].className = 'adv-info-btn active-tab';
    }

    /*********************************************************
      Sorter function
    *********************************************************/

  }, {
    key: 'sorter',
    value: function sorter(f) {
      return function (a, b) {
        var x = a[f];
        var y = b[f];

        if (x == '') return 1;

        if (x.includes('/')) x = new Date(x);
        if (y.includes('/')) y = new Date(y);

        if (x < y) return 1;
        if (x < y) return -1;
        return 0;
      };
    }
  }]);

  return Display;
}();

var Entry = function () {
  function Entry(name, version, publishDate, requestDate, requester, params, desc, link, filter, field, formats, category, deprecated) {
    _classCallCheck(this, Entry);

    /* Object Variables */
    this._name = name ? name : "Should Never Occur";
    this._version = version ? version : "Should Never Occur";
    this._publishDate = publishDate ? publishDate : '';
    this._requestDate = requestDate ? requestDate : '';
    this._requester = requester ? requester : '';
    this._params = params ? params : '';
    this._description = desc ? desc : "N/A";
    this._link = link ? link : "http://pds:9101";
    this._filter = filter ? filter : '';
    this._field = field ? field : '';
    this._category = category ? category : "Should Never Occur";
    this._format = formats;
    this._deprecated = deprecated;

    /* Adjusted Variables */
    this._paramsSplit = this.splitter(this._params);
    this._paramsDescSplit = this.splitter(this._paramsDesc);
    this._filters = this.splitter(this._filter);
    this._fields = this.splitter(this._field);
    this._categories = this.splitter(this._category);
    this._formats = this.splitter(this._format);

    this._paramsCount = this.counter(this._paramsSplit);
  }

  _createClass(Entry, [{
    key: 'splitter',
    value: function splitter(_item) {
      if (_item) {
        try {
          var _items = _item.split("|");
          return _items;
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, {
    key: 'counter',
    value: function counter(_arr) {
      if (_arr) {
        return _arr.length;
      } else return 0;
    }
  }]);

  return Entry;
}();

var Controller = function () {
  function Controller(data) {
    _classCallCheck(this, Controller);

    this.document = document;

    this.dbData = [];
    this.display;

    this.getData(data);
    this.getDisplay();
  }

  /************************
    Retrieve Data from DB
  /************************/


  _createClass(Controller, [{
    key: 'getData',
    value: function getData(d) {
      var _this = this;

      d.forEach(function (r) {
        for (var i in r) {
          if (r[i] == null) r[i] = "";
        }

        var report = new Entry(r.report_name.toString(), r.version.toString(), r.publish_date.toString(), r.request_date.toString(), r.requester.toString(), r.parameters.toString(), r.description.toString(), r.link.toString(), r.filters.toString(), r.fields.toString(), r.formats.toString(), r.category.toString(), r.deprecated.toString());

        _this.dbData.push(report);
      });
    }

    /************************
      Add Data to DB
    ************************/

  }, {
    key: 'createNewReport',
    value: function createNewReport(s) {
      /* Exports */
      var _formats = $('.export-choice.selected-choice'),
          _fstr = [];

      _formats.each(function (_f) {
        _fstr.push($(_formats[_f]).text().replace(/\s/g, ''));
      });
      _fstr = _fstr.join("|");

      /* Parameters */
      var _paramName = $('.param-input'),
          _paramDesc = $('.param-desc-input');
      var _pstr = [],
          _tstr = "";

      _paramName.each(function (_p) {
        if (_paramName[_p].value == "") return true;
        _paramDesc[_p].value != "" ? _pstr.push(_paramName[_p].value + ":" + _paramDesc[_p].value) : _pstr.push(_paramName[_p].value);
      });

      _pstr = _pstr.join('|');

      // checks if deprecated reports exist and changes status
      var _rptName = $('#new-name').val();
      s.emit('deprecate-reports', _rptName);

      /* Data Obj for DB */
      var _data = {
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

      if (!_data.report_name) {
        $('#new-name').attr('placeholder', "*Report Name is Required*");
        $('#new-name').addClass('required-field');
      }
      if (!_data.version) {
        $('#new-version').attr('placeholder', "*Version is Required*");
        $('#new-version').addClass('required-field');
      }
      if (!_data.category) {
        $('#new-category').attr('placeholder', "*Category is Required*");
        $('#new-category').addClass('required-field');
      }

      if (_data.report_name && _data.version && _data.category) {
        console.log("Generating New Report");
        s.emit('create-report', _data);
        this.reportModal();
      } else {
        console.log("Data not entered correctly");
      }

      console.log(_data);
    }

    /************************
      updates Data in DB by report name/version
    ************************/

  }, {
    key: 'updateReport',
    value: function updateReport(s) {
      var _data = {
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

      if (!_data.report_name) {
        $('#new-name').attr('placeholder', "*Report Name is Required*");
        $('#new-name').addClass('required-field');
      }
      if (!_data.version) {
        $('#new-version').attr('placeholder', "*Version is Required*");
        $('#new-version').addClass('required-field');
      }
      if (!_data.category) {
        $('#new-category').attr('placeholder', "*Category is Required*");
        $('#new-category').addClass('required-field');
      }

      if (_data.report_name && _data.version && _data.category) {
        console.log("Generating New Report");
        s.emit('update-report', _data);
        this.reportModal();
      } else {
        console.log("Data not entered correctly");
      }

      console.log(_data);
    }
    /************************
      Reset Modal to Default
    ************************/

  }, {
    key: 'resetModal',
    value: function resetModal() {
      $('#new-name').prop('disabled', false);
      $('#new-version').prop('disabled', false);
      $('#new-name').removeClass('required-field');
      $('#new-version').removeClass('required-field');
      $('#new-category').removeClass('required-field');
      $('#new-name').attr('placeholder', "Report Name");
      $('#new-version').attr('placeholder', "Version");
      $('#new-category').attr('placeholder', "Category");
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

      for (var i = 2; i <= 5; i++) {
        $('.name-' + i).hide();
        $('.desc-' + i).hide();
      }

      $('.param-input').val('');
      $('.param-desc-input').val('');

      $('#create-rpt-submit').show();
      $('#update-rpt-submit').hide();
    }

    /************************
      Create Display Object
    ************************/

  }, {
    key: 'getDisplay',
    value: function getDisplay() {
      try {
        this.display = new Display(this.dbData);
      } catch (e) {
        console.log(e);
      }
    }

    /************************
      Generate Report Panel
    ************************/

  }, {
    key: 'reportSelect',
    value: function reportSelect(_el) {
      var _name = _el.parents().children('.rpt-name').text().trim();
      var _ver = _el.parents().children('.rpt-ver').text();

      this.display.infoSet(_name, _ver);
    }
  }, {
    key: 'searchSelect',
    value: function searchSelect(_el) {
      var _data = _el.parents().children('.rpt-searcher').text();
      _data = _data.split(':');

      this.display.infoSet(_data[0], _data[1]);
    }
  }, {
    key: 'advInfoChange',
    value: function advInfoChange(_el) {
      // grab current report
      var _data = _el.parents('#report-adv-info').siblings('#report-info-name');
      var _name = _data.children('#rpt-name').text().trim();
      var _ver = _data.children('#rpt-version').text().split('v.');

      // grab selected tab
      var _obj = this.display.reportFind(_name, _ver[1]);
      var _sec = _el.children().text();

      this.display.generateAdvInfo(_obj, _sec);
    }

    /************************
      Category Seclector
    ************************/

  }, {
    key: 'categorySelect',
    value: function categorySelect(_el) {
      $('#table-search').hide();
      $('#limiter').show();

      var _id = _el.children().text();
      _id = _id.replace(/[ ,]+/g, "-").toLowerCase();

      if (_id == 'all-reports') {
        $('#limiter').children().show();
        $('#deprecated').hide();
      } else if (_id == 'deprecated') {
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

  }, {
    key: 'reportTabSwitch',
    value: function reportTabSwitch(_el) {
      var _val = $('#report-info-name').text() == "";
      var _text = _el[0].innerText;
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
  }, {
    key: 'reportModal',
    value: function reportModal() {
      this.resetModal();
      var _obj = $('#modal-container');

      if (_obj.hasClass('hide-modal')) {
        _obj.removeClass('hide-modal');
      } else {
        _obj.addClass('hide-modal');
      }
    }
  }, {
    key: 'updateModal',
    value: function updateModal(_el) {
      var _data = _el.parents('#report-info-name');
      var report_name = _data.children('#rpt-name').text().trim();
      var version = _data.children('#rpt-version').text().split('v.')[1];
      var report = this.display.reportFind(report_name, version);
      var _obj = $('#modal-container');
      var params = report._params.split("|");
      var formats = report._formats;

      if (_obj.hasClass('hide-modal')) {
        _obj.removeClass('hide-modal');
      } else {
        _obj.addClass('hide-modal');
      }

      $.each(report, function (i, v) {
        if (v == "N/A") report[i] = "";
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

      $.each(params, function (i, v) {
        var tmpParam = v.split(":");
        $('.param-input.name-' + (i + 1)).val(tmpParam[0]).show();
        $('.param-desc-input.desc-' + (i + 1)).val(tmpParam[1]).show();
      });

      $.each(formats, function (i, v) {
        $('.export-choice.' + v.toLowerCase()).addClass('selected-choice');
      });
    }
  }, {
    key: 'search',
    value: function search() {
      var _text = $('.search-text').val();
      this.display.generateGlobalSearch(_text);
    }
  }, {
    key: 'advancedSearch',
    value: function advancedSearch() {
      console.log("Decided to skip feature, leaving blank space in case wanted at a later point");
    }

    /************************
      Creates additional parameter options in modal
    ************************/

  }, {
    key: 'addParameter',
    value: function addParameter(_el) {
      var _v = $('.param-input:visible').length + 1;

      if (_v <= 5) {
        $('#fa-changer').css('transform', 'rotate(45deg)');
        setTimeout(function () {
          $('#fa-changer').css('transform', 'rotate(90deg)');
        }, 500);

        $('.name-' + _v).show();
        $('.desc-' + _v).show();
      } else {
        console.log("Max Params");
      }
    }

    /************************
      Creates additional parameter options in modal
    ************************/

  }, {
    key: 'tableSort',
    value: function tableSort(_el) {
      var _f = _el.text();
      if (_f == 'Report Name') _f = '_name';
      if (_f == 'Version') _f = '_version';
      if (_f == 'Parameters') _f = '_params';
      if (_f == 'Request Date') _f = '_requestDate';
      if (_f == 'Requester') _f = '_requester';
      if (_f == 'Publish Date') _f = '_publishDate';
    }
  }]);

  return Controller;
}();

var Main = function Main(socket) {
  var _this2 = this;

  _classCallCheck(this, Main);

  socket.on('connect', function () {
    console.log('Connected to Server!');
  });
  socket.on('disconnect', function () {
    console.log('Disconnected from Server!');
  });
  socket.on('report-data', function (d) {
    // console.log("Data received: ");
    // console.log(d);
    _this2.controller = new Controller(d);
  });
};

jQuery.fn.rotate = function (rot) {
  var context = this;
  $(context).css({
    '-webkit-transform': 'rotate(' + rot + 'deg)',
    '-moz-transform': 'rotate(' + rot + 'deg)',
    '-ms-transform': 'rotate(' + rot + 'deg)',
    'transform': 'rotate(' + rot + 'deg)'
  });
  if (rot == 0) {
    $(context).css('margin-top', '0px');
  } else {
    $(context).css('margin-top', '-60px');
  }
};

(function (_) {

  var socket = io({
    reconnection: false,
    reconnectionAttempts: 1,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });

  $('body').on('click', '.adv-info-btn', function (e) {
    main.controller.advInfoChange($(this));
  });

  $('body').on('click', '.rpt-click', function (e) {
    main.controller.reportSelect($(this));
  });
  $('body').on('click', '.fa-edit', function (e) {
    main.controller.updateModal($(this));
  });

  $('body').on('click', '.menu-option', function (e) {
    main.controller.categorySelect($(this));
  });

  $('.report-panel-gen').click(function (e) {
    main.controller.reportTabSwitch($(this));
  });

  $('.report-modal').click(function (e) {
    main.controller.reportModal();
  });

  $('.global-search').click(function (e) {
    main.controller.search();
  });

  $('.search-text').keyup(function (e) {
    main.controller.search();
  });

  $('#adv-search-submit').click(function (e) {
    main.controller.advancedSearch();
  });

  $('#create-rpt-submit').click(function (e) {
    main.controller.createNewReport(socket);
  });

  $('#update-rpt-submit').click(function (e) {
    main.controller.updateReport(socket);
  });

  $('body').on('click', '.search-title', function (e) {
    main.controller.searchSelect($(this));
  });

  $('.reload-page').click(function (e) {
    location.reload();
  });

  $('body').on('click', '#new-param-button', function (e) {
    main.controller.addParameter($(this));
  });

  $('.export-choice').click(function (e) {
    $(this).toggleClass('selected-choice');
  });

  $('body').on('click', '.table-cat-sort', function (e) {
    main.controller.tableSort($(this));
  });

  /* Easter Egg Scripts */
  $('.easter-egg').click(function (e) {
    // $('#table-container').toggleClass('haha').toggleClass('normal');
    // scrollReDraw();

    if (!$('body').hasClass('haha')) $('body').rotate(180);else $('body').rotate(0);
    $('body').toggleClass('haha');
  });

  // $('#table-container').toggleClass('normal');
  var main = new Main(socket);
})();