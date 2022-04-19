import users from '../data.js';

export default class MockApi {
  #term;
  #pageNumber;

  #createRequest() {
    return new Promise((resolve) => { this.#getUsersByTerm(resolve); });
  }

  #getUsersByTerm(resolve) {
    const interimResults = (
      users.filter((user) => user.name.toLowerCase().includes(this.#term))
    );
    const answer = {
      users: [],
      resultsNumber: interimResults.length,
    };

    for (let i = 6 * this.#pageNumber; i < 6 * (this.#pageNumber + 1); i++) {
      const user = interimResults[i];
      if (user === undefined) continue;
      answer.users.push(user);
    }

    resolve(answer);
  }

  sendRequest(term, pageNumber) {
    this.#term = term.toLowerCase();
    this.#pageNumber = Number(pageNumber);
    return this.#createRequest();
  }
}
