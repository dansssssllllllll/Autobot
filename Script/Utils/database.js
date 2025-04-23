const fs = require('fs');
const path = require('path');

class Database {
  constructor(directory) {
    this.directory = directory;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  getFile(uid, type) {
    return path.join(this.directory, type, `${uid}.json`);
  }

  get(uid, type) {
    const file = this.getFile(uid, type);
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return null;
  }

  set(uid, type, data) {
    const file = this.getFile(uid, type);
    const dir = path.join(this.directory, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(data));
  }
}

module.exports = Database;
  
