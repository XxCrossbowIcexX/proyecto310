const fs = require("fs");
const path = require("path");

function LeerJsonPorCarpeta(carpeta, id) {
  const filePath = path.join(__dirname, "..", "api", carpeta, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data;
}

module.exports = LeerJsonPorCarpeta;
