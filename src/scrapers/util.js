const idGenerator = function (id) {
    // Typecast to string
    id = String(id);
    // Takes an id and returns a 16 character string of 0x000... + id
    if (!id.match(/^[0-9]+$/)) throw new Error(`Invalid ID: ${id}`);
    return id.padStart(15, "0");
}
// Todo - Automate this using the official api
const AgentArray = [
    "astra",
    "breach",
    "brimstone",
    "chamber",
    "cypher",
    "fade",
    "gekko",
    "harbor",
    "jett",
    "kayo",
    "killjoy",
    "neon",
    "omen",
    "phoenix",
    "raze",
    "reyna",
    "sage",
    "skye",
    "sova",
    "viper",
    "yoru"
];

module.exports = { idGenerator, AgentArray };