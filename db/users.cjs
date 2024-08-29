const client= require('./client.cjs');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const axios= require('axios');

require('dotenv').config();

const createUser= async(username, password, userEmail)=> {
  try {
    const encryptPassword= await bcrypt.hash(password, 5);

    await client.query(`
      INSERT INTO users (username, password, email)
      VALUES ($1, $2, $3);`, [username, encryptPassword, userEmail])
      
  }catch(err) {
    console.log("User not created!", err)
  }
}

const getUser= async(username, password)=> {
  const {rows: [user]}= await client.query(`
    SELECT * FROM users
    WHERE username= $1;`, [username]);

    const passwordMatch= await bcrypt.compare(password, user.password);

    if (user && passwordMatch) {
      const assignToken= await jwt.sign({userId: user.id}, process.env.JWT_SECRET);
      return assignToken
    }else {
      throw new Error('Either username or password do not match!')
    }
}

const getUserByToken= async(token)=> {
  const {userId} = jwt.verify(token, process.env.JWT_SECRET);

  const {rows: [user]}= await client.query(`
    SELECT id, username FROM users
    where id=${userId}
    `);

    return user;
}

module.exports= {
  createUser,
  getUser,
  getUserByToken
}