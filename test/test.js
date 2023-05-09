const assert = require('assert');
const { describe } = require('mocha');
const axios = require('axios');

describe("API Root",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Player",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/player/1")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Players",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/players")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Team",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/team/1")
            .then((response) => {
                let isValidData = true;
                let r = response.data;
                if(r.status != "Success")
                {
                    // check if it's a team not found error
                    if(r.error.message !== "Team Not Found") isValidData = false;
                } else if (r.status === "Success") {
                    // check if it's a team object
                    if(r.data.type !== "team") isValidData = false;
                } else {
                    isValidData = false;
                }
                assert.equal(isValidData, true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Teams",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/teams")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Rankings",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/rankings/na")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Events",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/events")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Event",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/event/1")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Matches",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/matches")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

describe("API Match",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/match/1")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err);
            })
    }); 
});

describe("API News",() => {
    it("should return a 200", (done) => {
        axios.get("http://localhost:3000/api/news")
            .then((response) => {
                assert.equal(isSuccessfulResponse(response.data), true);
                done();
            })
            .catch((err) => {
                done(err); 
            })
    });
});

describe("API 404",() => {
    it("should return a 404", (done) => {
        axios.get("http://localhost:3000/api/404")
            .then((response) => {
                assert.equal(response.data.status, "Failed");
                assert.equal(response.data.error.stack.cause, "Invalid Endpoint");
                done();
            })
            .catch((err) => {
                done(err);
            })
    });
});

const isSuccessfulResponse = (data) => {
    if(data.status == "Success") return true;
    return false;
}