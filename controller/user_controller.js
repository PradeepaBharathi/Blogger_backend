import { client } from "../db.js";
import { ObjectId } from "bson";


export function getUser() {
    return client
        .db("Blogger")
        .collection("users")
        .find()
        .toArray();
}

export function signupUser(data) {
    return client
        .db("Blogger")
        .collection("users")
        .insertOne(data)

    
}
export function LoginUser(data) {
     return client
        .db("Blogger")
        .collection("Loginusers")
        .insertOne(data)
}

export function tokenUsed(data) {
    return client
        .db("Blogger")
        .collection("tokens")
        .insertOne(data)
}

export function getUserByEmail(email) {
    const query = { Email: email };
    console.log("Query:", query);
    return client
        .db("Blogger")
        .collection("users")
        .findOne(query)

}

export function getUserByName(name) {
    const query = { Name: name };
    console.log("Query:", query);
    return client
        .db("Blogger")
        .collection("users")
        .findOne(query)

}

export function getUserbyId(id) {
    return client
        .db("Blogger")
        .collection("users")
        .findOne({_id : new ObjectId(id)})
        
}


export async function addBlogIdToUser(userId, blogId) {
    const query = { _id: new ObjectId(userId) };
    const update = { $addToSet: { blogs: new ObjectId(blogId) } };

    const result = await client
        .db("Blogger")
        .collection("users")
        .updateOne(query, update);

    return result;
}
export function editUserBlogs(user) {
    return client
        .db("Blogger")
        .collection("users")
        .updateOne({_id : new ObjectId(user._id)},{$set:{blogs:user.blogs}})
        
}


