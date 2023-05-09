const idGenerator = function (id) {
    // Takes an id and returns a 16 character string of 0x000... + id
    if (!id) throw new Error("Invalid ID")
    return id.padStart(15, "0");
}
module.exports = { idGenerator };