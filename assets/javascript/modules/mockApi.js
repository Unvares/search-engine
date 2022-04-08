import users from '../data.js';

export default (function(self = {}) {
  let _term;
  let _pageNumber;

  function _createRequest() {
    return new Promise(_getUsersByTerm);
  }

  function _getUsersByTerm(resolve) {
    const interimResults = (
      users.filter((user) => user.name.toLowerCase().includes(_term))
    );
    const answer = {
      users: [],
      resultsNumber: interimResults.length,
    };

    for (let i = 6 * _pageNumber; i < 6 * (_pageNumber + 1); i++) {
      const user = interimResults[i];
      if (user === undefined) continue;
      answer.users.push(user);
    }

    resolve(answer)
  }

  self.sendRequest = (term, pageNumber) => {
    _term = term.toLowerCase();
    _pageNumber = Number(pageNumber);
    return _createRequest();
  };

  return self;
})();
