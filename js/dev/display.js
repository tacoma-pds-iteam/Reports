/* display.js
 Class defines all display methods for reports client.

*/
class Display {
  constructor(dataObj) {
    this.tableObj = dataObj;
    this.generation(this.tableObj);
  }
  /* function finds report and calls utility function to get data */
  infoSet(_t, _v) {
    $('#report-info-container').children().hide();
    $('#report-info-main').show();

    let _data = this.reportFind(_t, _v);

    this.generateInfo(_data);
    this.generateAdvInfo(_data, "Parameters");
  }

  /* Utility function to find specific report for information panel */
  reportFind(_t, _v) { // title, version
    let _data;
    let _obj = this.tableObj;
    if (_obj) {
      for (let i = 0; i < _obj.length; i++) {
        if (_t == _obj[i]._name && _v == _obj[i]._version) { // if name and version is found set data
          _data = _obj[i];
        }
      }
    }

    return _data;
  }

  /* Master function to call all generation */
  generation(_obj) {
    let _cat = this.getCategories(_obj); 

    this.generateMenu(_cat);
    this.generateTable(_cat, _obj);
  }

  /* Helper function to get categories dynamically based on reports in table */
  getCategories(_obj) {
    let _cat = [];
    if (_obj) {
      for (let i = 0; i < _obj.length; i++) {
        if (_cat.includes(_obj[i]._categories[0]) == false) { // if not found in current list, add it
          _cat.push(_obj[i]._categories[0]);
        }
      }
    }

    _cat.sort(); // sort and return
    return _cat;
  }

  /* Function Generates html for dynamic category menu based on category array parameter */
  generateMenu(_cat) {
    let _choices =  `
      <div class='menu-option'>
        <p>All Reports</p>
      </div>`;

    if (_cat) {
      for (let i = 0; i < _cat.length; i++) { 
        _choices +=
          `<div class='menu-option'>
            <p>${_cat[i]}</p>
          </div>`;
      }
    }

    _choices += `<div class='menu-option'>
        <p>Deprecated</p>
      </div>`;

    $("#menu-choices").html(_choices); // append html to page container
  }

  /* Function Generates the entire report table */
  generateTable(_cat, _obj) {
    _obj.sort(this.sorter('_publishDate')); // sorted report list by publish date
    let _table = "";
    let _id;

    if (_cat) {
      for (let i = 0; i < _cat.length; i++) {
        _id = _cat[i].replace(/[ ,]+/g, "-").toLowerCase(); // generate category element id
        _table +=
          `
          <div id='${_id}'>
          <div class='table-header'>
            ${_cat[i]}
          </div>
          <div class='table-content'>
            <table>
              <thead>
                <tr>
                  <th width='30%'><div style='text-align:left' class='table-cat-sort'>Report Name</div></th>
                  <th class='table-cat-sort'>Version</th>
                  <th class='table-cat-sort'>Parameters</th>
                  <th class='table-cat-sort'>Request Date</th>
                  <th class='table-cat-sort'>Requester</th>
                  <th class='table-cat-sort'>Publish Date</th>
                  <th width='10%' ><div style='text-align:center'>Link</div></th>
                </tr>
              </thead>
              <tbody>`; // generate category table headers

        if (_obj) {
          for (let k = 0; k < _obj.length; k++) {
            if (_cat[i] == _obj[k]._categories[0] && _obj[k]._deprecated == "N") { // if report has current category add it to html
              _table +=
                `
              <tr class='table-rpt-option'>
                <td class='rpt-click rpt-name'><div style='text-align:left'>${_obj[k]._name}</div></td>
                <td class='rpt-click rpt-ver'>${_obj[k]._version}</td>
                <td class='rpt-click'>${_obj[k]._paramsCount}</td>
                <td class='rpt-click'>${_obj[k]._requestDate}</td>
                <td class='rpt-click'>${_obj[k]._requester}</td>
                <td class='rpt-click'>${_obj[k]._publishDate}</td>
                <td><button type='button' class='rpt-link' onclick="window.open('${_obj[k]._link}')"><i class="fas fa-link"></i></button></td>
              </tr>
              `;
            }
          }
        }
        _table +=
          `
                </tbody>
              </table>
            </div>
          </div>
          </div>`; // add all end tags
      }

      _table += `
      <div id='deprecated'>
      <div class='table-header'>
        Deprecated
      </div>
      <div class='table-content'>
        <table>
          <thead>
            <tr>
              <th width='30%'><div style='text-align:left'>Report Name</div></th>
              <th width=''>Version</th>
              <th width=''>Parameters</th>
              <th width=''>Request Date</th>
              <th width=''>Requester</th>
              <th width=''>Publish Date</th>
              <th width='10%' ><div style='text-align:center'>Link</div></th>
            </tr>
          </thead>
          <tbody>`; // add deprecated reports header

      if (_obj) {
        for (let k = 0; k < _obj.length; k++) {
          if (_obj[k]._deprecated == "Y") { // add html if report is deprecated
            _table +=
              `
            <tr class='table-rpt-option'>
              <td class='rpt-click rpt-name'><div style='text-align:left'>${_obj[k]._name}</div></td>
              <td class='rpt-click rpt-ver'>${_obj[k]._version}</td>
              <td class='rpt-click'>${_obj[k]._paramsCount}</td>
              <td class='rpt-click'>${_obj[k]._requestDate}</td>
              <td class='rpt-click'>${_obj[k]._requester}</td>
              <td class='rpt-click'>${_obj[k]._publishDate}</td>
              <td><button type='button' class='rpt-link' onclick="window.open('${_obj[k]._link}')"><i class="fas fa-link"></i></button></td>
            </tr>
            `;
          }
        }
      }
      _table +=
        `
              </tbody>
            </table>
          </div>
        </div>`; // add end tag
    }

    $('#table-search').hide();
    $('.search-text').val('');
    $("#limiter").html(_table).show(); // add html to container
    $('#deprecated').hide();
  }

  /* Function generates the general information on report panel */
  generateInfo(_obj) {
    // Required Fields
    let _name = _obj._name;
    let _version = _obj._version;
    let _categories = _obj._categories;

    // Additional Fields
    let _pubDate = _obj._publishDate != '' ? _obj._publishDate : 'Not Available';
    let _reqDate = _obj._requestDate != '' ? _obj._requestDate : 'Not Available';
    let _requester = _obj._requester != '' ? _obj._requester : 'Not Available';
    let _desc = _obj._description != 'N/A' ? _obj._description : 'No Description Available';
    let _link = _obj._link;
    let _formats = _obj._formats;

    let _title = `
      <span id="rpt-name"><i class="fas fa-edit"></i> ${_name}</span>
      <span id="rpt-version">v.${_version}</span>`;

    // Set Base Info
    $("#report-info-name").html(_title);
    $("#report-publish-date").html(_pubDate);
    $("#report-request-date").html(_reqDate);
    $("#report-requester").html(_requester);
    $("#report-categories").html(_categories.join(', '));
    $("#report-description").html(_desc);

    // Set report links
    let _linkHTML = `<h3>Report Links:</h3><a href='${_link}' target='_blank'>Direct Link</a>`;
    let _addFormat = 0;
    let _addLink;

    if (_formats) {
      for (let i = 0; i < _formats.length; i++) {
        if (_formats[i] == 'CSV') {
          _addFormat = '8';
        } else if (_formats[i] == 'PDF') {
          _addFormat = '5';
        } else if (_formats[i] == 'Excel') {
          _addFormat = '6'
        }

        _addLink = _link + `&export=true&exporttype=`;
        _addLink += _addFormat;
        _linkHTML += `<a href='${_addLink}' target='_blank'>${_formats[i]}</a>`;
      }
    }

    $("#report-links").html(_linkHTML);
  }

  /* Function generates adv info on bottom of report panel */
  generateAdvInfo(_obj, _section) {
    let _advInfo = "";
    if (_section == "Parameters") { // build parameters info
      this.AdvInfoButtonToggle(0); // set tab
      let _params = _obj._paramsSplit, _paramsDesc =[];
      for(let p in _params){
        let pSplit = _params[p].split(':'); 
        if(pSplit.length > 1){
          _params[p] = pSplit[0];
          _paramsDesc.push(pSplit[1]);
        }
      }

      if (_params) {
        for (let i = 0; i < _params.length; i++) { // generate html for params
          if(_params[i] != "N/A") {
            _advInfo += `<tr><td width='50%'>${_params[i]}</td><td width='50%'>`;

            if (_paramsDesc[i] && _paramsDesc.length <= i + 1) {
              _advInfo += `${_paramsDesc[i]}`;
            } else {
              _advInfo += 'N/A';
            }

            _advInfo += `</td></tr>`;
            } else {
              _advInfo = `<tr><td>No Input Parameters</td></tr>`;
            }
          }
      } else {
        _advInfo = `<tr><td>No Input Parameters</td></tr>`;
      }
    } 
    if (_section == "Fields") { // build fields info
      this.AdvInfoButtonToggle(1);
      let _fields = _obj._fields;

      if (_fields) {
        for (let i = 0; i < _fields.length; i++) {
          if(_fields[i] != "N/A") {
            _advInfo += `<tr><td>${_fields[i]}</td></tr>`;
          } else {
            _advInfo = `<tr><td>No Fields Indicated</td></tr>`;
          }
        }
      } else {
        _advInfo = `<tr><td>No Fields Indicated</td></tr>`;
      }

    }
    if (_section == "Filters") { // build filters info
      this.AdvInfoButtonToggle(2);
      let _filters = _obj._filters;

      if (_filters) {
        for (let i = 0; i < _filters.length; i++) {
          if(_filters[i] != "N/A") {
            _advInfo += `<tr><td>${_filters[i]}</td></tr>`;
          } else {
            _advInfo = `<tr><td>No Filters on report</td></tr>`;
          }
        }
      } else {
        _advInfo = `<tr><td>No Filters on report</td></tr>`;
      }

    }
    $("#report-adv-generation").html(_advInfo); // set html
  }

  /* Function generates search results based on search text */
  generateGlobalSearch(_text) {
    let _obj = this.tableObj;
    let _search;
    let _curItem;
    let _items = [];
    let _name, _version, _description, _requester, _holder;
    let _counter = 0;

    if (_text) {
      _search = _text.toLowerCase().toString();
    } else {
      _search = null;
    }

    for (let i = 0; i < _obj.length; i++) {
      _holder = [
        _obj[i]._name,
        _obj[i]._version,
        _obj[i]._description,
        _obj[i]._requester
      ];
      if (_holder[0].toLowerCase().indexOf(_search) !== -1) { // check name
        _items.push(_holder);
      } else if (_holder[1].toLowerCase().indexOf(_search) !== -1) { // check version
        _items.push(_holder);
      } else if (_holder[2].toLowerCase().indexOf(_search) !== -1) { // check description
        _items.push(_holder);
      } else if (_holder[3].toLowerCase().indexOf(_search) !== -1) { // check requester
        _items.push(_holder);
      }
    }

    if (_items.length > 0) {
      _counter = _items.length;
    }

    let _table = `
      <div class='table-header'>
        ${_counter} search results
      </div>
      <div id='search-results-container'>`;

    if (_items.length > 0) {
      for (let i = 0; i < _items.length; i++) { // gen html for each search result 
        _table += `
          <div class='search-result'>
            <span class='rpt-searcher'>${_items[i][0]}:${_items[i][1]}</span>
            <div class='search-title'>${i+1}. ${_items[i][0]}</div>
            <div><b>Version:</b> ${_items[i][1]}</div>
            <div><b>Requester:</b> ${_items[i][3]}</div>
            <div><b>Description:</b><br> ${_items[i][2]}</div>
          </div>
          `;
      }
    }

    _table += `</div>`;

    $('#limiter').hide();
    $('#table-search').show();
    $('#table-search').html(_table); // push to container
  }

  /* Quick function for toggling adv info button */
  AdvInfoButtonToggle(_b) {
    $("#report-info-label").children(".adv-info-btn").removeClass('active-tab');
    $("#report-info-label").children(".adv-info-btn")[_b].className = 'adv-info-btn active-tab'
  }

  /* Utility function for sorting */
  sorter(f) {
    return function(a, b) {
      let x = a[f];
      let y = b[f];

      if(x == '')
        return 1;

      if(x.includes('/'))
        x = new Date(x);
      if(y.includes('/'))
        y = new Date(y);

      if(x < y)
        return 1;
      if(x < y)
        return -1;
      return 0; 
    }
  }
}
