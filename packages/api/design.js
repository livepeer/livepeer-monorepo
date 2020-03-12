

const key = "user/abc123";
const indices = [
  "user-emails/eli@iame.li",
  "user-usernames/iameli"
];

// In a controller:

// What want
store.put(eliUser)
// And it creates those things automatically!

store.delete(eliUser);
// They're all gone now

store.put = doc => {
  const operations = [
    db.write("user/abc123", eliUser)
  ]
  
  for (const field in fields) {
    if (schema[field].index === true) {
      operations.push(
        db.write(`user-${field}/${eliUser[field]}`, { link: "user/abc123" })
      )
    }
  }

  await Promise.all(operations);
}

// user/abc123
// user-email/eli@iame.li/abc123

const eliUser = store.find("user", "email", "eli@iame.li");

// Searching by index...?


const [user] = await store.find("user", {email: "eli@iame.li"});
// list: user-email/eli@iame.li
// reply: [user-email/eli@iame.li/abc123]
// user/abc123

store.find("objectstore", {userId: "abc123"})
// list: objectstore-userId/abc123/os-1
// list: objectstore-userId/abc123/os-2
// list: objectstore-userId/abc123/os-3

store.find("user", {id: "abc123"});
// user/abc123

// Getting one user...?
store.get("user", "abc123");

// Users can only have one email address
// Email addresses only have one user

// user-email/eli@iame.li/abc123
// user-email/eli@iame.li/asdfad

// Users can have many object stores
// Object stores only have one user

const angieUser = {
  id: "angie123",
  hasDog: true,
  age: 100
};

const eliUser = {
  kind: "user",
  id: "abc123",
  email: "eli@iame.li",
  username: "iameli",
  password: "lalala",
  salt: "whatever",
  hasDog: true,
  age: 6
};

// user-hasDog/true/angie123

const query = {
  startAt: "user-hasDog-age/true/000000050"
};



// user-hasDog-age/true/000000006/abc123
// user-hasDog-age/true/000000100/angie123

store.find = (kind, key, value) => {
  const records = await db.list(`${kind}-${key}/${value}`);
  // got user-email/eli@iame.li/abc123
  const firstRecord = records[0]
  const id = records.split("/")[2]; // abc123
  const ret = await db.get(`${kind}/${id}`);
  return ret;
}



// objectstore/os-123
const os = {
  id: "os-123",
  kind: "objectstore",
  userId: "abc123",
  credentials: "top secret"
};

// Can't just write to objectstore-userId/abc123 'cause there might be many!
// Could do:
// objectstore-userId/abc123/os-123
// objectstore-userId/abc123/os-456
// objectstore-userId/abc123/os-789

// user:
//   type: object
//   required:
//     - email
//     - password
//   additionalProperties: false
//   properties:
//     email:
//       type: string
//       description: user email address
//       example: useremail@gmail.com
//       index: true
//       unique: true
//     password:
//       type: string
//       example: thisisapassword
//     kind:
//       type: string
//       readOnly: true
//       example: user