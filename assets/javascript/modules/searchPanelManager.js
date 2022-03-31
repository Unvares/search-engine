app.modules.searchPanelManager = (function(self = {}) {
  const _searchLine = 
    document.querySelector('.search-panel__textfield');
  const _searchPanel =
    document.querySelector('.search-panel');

  function _listeners() {
    _searchPanel.addEventListener('submit', _handleSubmit);
    _searchLine.addEventListener('input', _manageMargin);
  }

  function _handleSubmit(event) {
    event.preventDefault();
  }

  function _manageMargin() {
    const searchPanelClassList =
      _searchPanel.classList;

    _searchLine.value.length
      ? searchPanelClassList.add('search-panel_focused')
      : searchPanelClassList.remove('search-panel_focused');
  }


  self.load = () => {
    _listeners();
  };

  return self;
})(app.modules.searchPanelManager);
