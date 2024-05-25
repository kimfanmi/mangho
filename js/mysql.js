const mysql = require('mysql');

class MySQL {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'mangho_user',
      password: '123321',
      database: 'manghodb'
    });
    this.isConnected = false; // 연결 상태를 나타내는 플래그
    this.connectTimeout = 60000; // 연결 타임아웃 설정 (60초)
    this.disconnectTimer = null; // 연결 해제를 위한 타이머
  }

  async connect() {
    if (!this.isConnected) {
      await this._doConnect(); // 연결 메소드 호출
      this.isConnected = true;
      this.disconnectTimer = setTimeout(() => {
        this.disconnect(); // 타임아웃 후 자동으로 연결 해제
      }, this.connectTimeout);
    }
  }

  async query(sql, values) {
    await this.connect(); // 쿼리를 실행하기 전에 연결을 확인하고 필요한 경우 연결 수립
    return new Promise((resolve, reject) => {
      this.connection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error.stack);
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  }

  async findUser(userId) {
    await this.connect(); // 사용자 조회 전에 연결을 확인하고 필요한 경우 연결 수립
    const sql = 'SELECT * FROM users WHERE userId = ?';
    const results = await this.query(sql, [userId]);
    if (results.length > 0) {
      // 사용자가 존재하는 경우
      const user = {
        userId: results[0].userId,
        userName: results[0].userName,
        // 기타 사용자 속성 추가
      };
      return user;
    } else {
      // 사용자가 존재하지 않는 경우
      return null;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      clearTimeout(this.disconnectTimer); // 타임아웃 타이머 해제
      await this._doDisconnect(); // 연결 해제 메소드 호출
      this.isConnected = false;
    }
  }

  _doConnect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MariaDB:', err.stack);
          reject(err);
          return;
        }
        console.log('Connected to MariaDB as id', this.connection.threadId);
        resolve();
      });
    });
  }

  _doDisconnect() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          console.error('Error ending connection to MariaDB:', err.stack);
          reject(err);
          return;
        }
        console.log('Connection to MariaDB closed.');
        resolve();
      });
    });
  }
}

module.exports = MySQL;
