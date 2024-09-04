const client= require('./client.cjs');
const {createUser}= require('./users.cjs');

const dropTables= async()=> {
  try {
    await client.query(`
      DROP TABLE IF EXISTS character_items;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS character;
      
      `);
  }catch(err) {
    console.log("Could not drop tables!!");
  }
}

const createUsersTable= async()=> {
  try {
    await client.query(`
      CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) NOT NULL UNIQUE,
      password VARCHAR(60) NOT NULL,
      email VARCHAR(60) NOT NULL,
      character1_id BIGINT,
      character2_id BIGINT,
      character3_id BIGINT,
      killcount BIGINT 
    );
    `);
  }catch(err) {
    console.log("Users table not created!");
  }
}

const syncAndSeed= async()=> {
  await client.connect();
  console.log("Connected to DB!");

  await dropTables();
  console.log("Tables dropped!");

  await createUsersTable();
  console.log("Users table created!");

  await createUser("Robin", "1234", "robin@testing.com");
  await createUser("Omesh", "1234", "omesh@testing.com");
  await createUser("Darren", "1234", "darren@testing.com");
  console.log("Users created!");

  await client.end();
  console.log("Disconnected from DB!");

}

syncAndSeed();

