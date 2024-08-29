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

const createItemsTable= async()=> {
  try {
    await client.query(`
     CREATE TABLE items(
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(30)
    );
    `);
  }catch(err) {
    console.log("Items table not created!!");
  }
}

const createCharacterTable= async()=> {
  try {
    await client.query(`
      CREATE TABLE character(
      id SERIAL PRIMARY KEY,
      name VARCHAR(30),
      description TEXT NOT NULL,
      avatar BIGINT NOT NULL,
      health INT NOT NULL
    );
    `);
  }catch(err) {
    console.log("Character table not created!!");
  }
}

const createCharacterItemsTable= async()=> {
  try {
    await client.query(`
      CREATE TABLE character_items(
      id SERIAL PRIMARY KEY,
      character_id INT,
      items_id INT,
      FOREIGN KEY (character_id) REFERENCES character(id),
      FOREIGN KEY (items_id) REFERENCES items(id)
    );
    `);
  }catch(err){
    console.log(err);
  }
}

// select character_items.id,
// character.name AS character_name,
// items.name AS items_name,
// items.type AS items_type,
// items.description AS items_description
// FROM character_items,
// JOIN character ON character_items.character_id=character.id,
// JOIN items ON character_items.items_id=items.id

const syncAndSeed= async()=> {
  await client.connect();
  console.log("Connected to DB!");

  await dropTables();
  console.log("Tables dropped!");

  await createUsersTable();
  console.log("Users table created!");

  await createItemsTable();
  console.log("Items table created!");

  await createCharacterTable();
  console.log("Character table created!");

  await createCharacterItemsTable();
  console.log("character_items table created!");

  await createUser("Robin", "1234", "robin@testing.com");
  await createUser("Omesh", "1234", "omesh@testing.com");
  await createUser("Darren", "1234", "darren@testing.com");
  console.log("Users created!");

  await client.end();
  console.log("Disconnected from DB!");

}

syncAndSeed();

