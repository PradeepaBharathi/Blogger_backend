import { client } from "../db.js";
import { ObjectId } from "bson";
import { getUserbyId } from "./user_controller.js";
export function getBlogs() {
    return client
        .db("Blogger")
        .collection("Blog")
        .find()
        .toArray()
}

export function addBlog(data){
    return client
    .db("Blogger")
    .collection("Blog")
    .insertOne(data)
}

export function getBlogsbyId(id) {
    return client
        .db("Blogger")
        .collection("Blog")
        .findOne({_id : new ObjectId(id)})
        
}

export function editBlogsbyId(id,updateData) {
    return client
        .db("Blogger")
        .collection("Blog")
        .findOneAndUpdate({_id : new ObjectId(id)},{$set:updateData})
        
}

export function DeleteBlogsbyId(id,data) {
    return client
        .db("Blogger")
        .collection("Blog")
        .findOneAndDelete({ _id: new ObjectId(id) },{$set:data})
        
}

export function getUserBlogs(userId) {
    return client
        .db("blogger")
        .collection("Blog")
        .find({ user: userId })
        .toArray()
}

export async function getUserBlogsByUserId(userId) {
    try {
        const user = await getUserbyId(userId);
        if (!user) {
            return null;
        }
        const userBlogs = await client
            .db("Blogger")
            .collection("Blog")
            .find({ user: userId }) 
            .toArray(); 

        return userBlogs;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}