"use strict"
const uuid = require('uuid');
const runQuery = require('../database/runquery')
// const logger = require('../js/event');

//登入
exports.login = async (req, res) => {
  try {
    const req_params = req.query
    const account = req_params.account
    const password = req_params.password
    const created_at = new Date()
    const sql = 'SELECT id,account,password,nickname,balance FROM users WHERE account=? AND password=?'
    const params = [account, password]
    const result = await runQuery(sql, params);
    console.log(result);
    const deletetoken = 'DELETE FROM tokens WHERE user_id = ?'
    const user_id = result[0].id
    await runQuery(deletetoken, user_id);
    const addtoken = 'INSERT INTO tokens(tokens,user_id,created_at) VALUES( ?, ?, ?)'
    const tokenparams = [uuid.v1().toString(), user_id, created_at]
    await runQuery(addtoken, tokenparams);
    const usetoken = 'SELECT tokens FROM tokens WHERE user_id = ?'
    await runQuery(usetoken, user_id);
    res.send({ data: result, success: true, message: '登入成功!', token: tokenparams[0] })
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: '登入失败！'
    })
  }
}
//註冊
exports.register = async (req, res) => {
  try {
    const req_params = req.query
    const account = req_params.account
    const password = req_params.password
    const nickname = req_params.nickname
    const created_at = new Date()
    const params = [account, password, nickname, created_at]
    const sql = 'insert into users(account,password,nickname,balance,created_at) VALUES( ?, ?, ?, 1000, ? )'
    await runQuery(sql, params);
    res.send({ success: true, message: '註冊完成！' })
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: '註冊失败！'
      
    })
  }
}
exports.getuser = async(req,res) =>{
  try{
    const req_params = req.body.params
    const token = req_params.token;
    const getId = 'SELECT user_id FROM tokens where tokens= ? '
    const user_id = await runQuery(getId, token)
    const getUser = 'SELECT nickname, balance FROM users'
    const result = await runQuery(getUser, user_id)
    res.send(result)
  }catch(error){
    console.log(error);
    res.send({
      errorMessage: error
      
    })
  }
}

  //取得最後一筆資料
  // exports.lastuser = async(req, res) => {
  //   try
  //     let online =' SELECT account FROM tokens ORDER BY created_at DESC LIMIT 1'
  //     const result = await runQuery(online);
  //     res.send(result);
  //   }catch(error){
  //     console.log(error)
  //   }
  // }
