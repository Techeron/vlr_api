const idGenerator = function (id) {
    // Takes an id and returns a 16 character string of 0x000... + id
    if (!id) throw new Error("Invalid ID")
    return id.padStart(15, "0");
}
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