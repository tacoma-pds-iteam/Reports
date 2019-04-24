/* entry.js class to generate an entry object for each report item in db */
class Entry {
  constructor(name, version, publishDate, requestDate, requester, params, desc, link, filter, field, formats, category, deprecated) {
    /* Object Variables */
    this._name = name ? name : "Should Never Occur";
    this._version = version ? version : "Should Never Occur";
    this._publishDate = publishDate ? publishDate : '';
    this._requestDate = requestDate ? requestDate : '';
    this._requester = requester ? requester : '';
    this._params = params ? params : '';
    this._description = desc ? desc : "N/A";
    this._link = link ? link : "";
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

  /* Function returns array if any pipes are found */
  splitter(_item) {
    if (_item) {
      try {
        let _items = _item.split("|");
        return _items;
      } catch (e) {
        console.log(e);
      }
    }
  }
  /* function returns length property if exists */
  counter(_arr) {
    if (_arr) {
      return _arr.length;
    } else return 0;
  }
}
