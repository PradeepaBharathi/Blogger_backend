import express from 'express';
import { DeleteBlogsbyId, addBlog, editBlogsbyId,  getBlogs, getBlogsbyId, getUserBlogs, getUserBlogsByUserId } from '../controller/blog_controller.js';

import { addBlogIdToUser,getUserbyId,editUserBlogs} from '../controller/user_controller.js';

const router = express.Router();

router.post('/create-blog', async (req, res) => {
    const firstPost = req.body;
    firstPost.createdAt = new Date()
    console.log(firstPost)
    try {
        if (!firstPost) {
            return res.status(400).json({ message: "no data availabe" })
        }

         const { title, description, image,user } = firstPost;
        if (!title || !description || !image || !user ) {
            return res.status(400).json({ message: "Please fill all fields" })
        }

        const existingUser = await getUserbyId(user)
        console.log(existingUser)
        if (!existingUser) {
            return res.status(400).json({ message: "no data availabe" })

        }
        
        const userName = existingUser.Name;
        const result = await addBlog({...firstPost,userName});
        console.log(result)
        if(!result.acknowledged){
            return res.status(400).json({message:"error occured"})
        }

        await addBlogIdToUser(user,result.insertedId)
        res.status(200).json({data:{...firstPost,userName},status:result})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error occured"})
    }
   }
)
router.get('/all-blog', async (req, res) => {
    
    try {
        const allblog =  await getBlogs(req);
        // console.log(studentData)
    if(!allblog){
        return res.status(400).json({message:"no data availabe"})
    }
    res.status(200).json({data:allblog})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
})

router.get('/blog/:id', async (req, res) => {
    
    try {
        const {id} = req.params
        const blog =  await getBlogsbyId(id);
        // console.log(studentData)
    if(!blog){
        return res.status(400).json({message:"no data availabe"})
    }
    res.status(200).json({data:blog})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
})

router.get('/blog/:id', async (req, res) => {
    
    try {
        const {id} = req.params
        const blog =  await getBlogsbyId(id);
        // console.log(studentData)
    if(!blog){
        return res.status(400).json({message:"no data availabe"})
    }
    res.status(200).json({data:blog})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
})

router.put("/edit-blog/:id", async (req, res) => {
    const { id } = req.params;
    const updateBlog = req.body;

    try {
        if (!updateBlog || !id) {
       return res.status(400).json({message:"no data available"})
    }

    const findBlog = await getBlogsbyId(id);
    let newBlog = { ...findBlog,...updateBlog }
    
        const result = await editBlogsbyId(id, newBlog)
    if (!result ||  !result.lastErrorObject.updatedExisting) {
       return res.status(400).json({message:"Error occured"})
    }
    res.status(200).json({updateBlog:newBlog,status:result})
    } catch (error) {
        console.log(error)
       return res.status(500).json({message:"server error occured"})
    }


})


router.delete("/delete/:id",async(req,res)=>{
    try {
        const { id } = req.params
        const deleteBlog = req.body;
        if(!id || !deleteBlog){
            return res.status(400).json({message:"Wrong request"})
        }

        const blog = await getBlogsbyId(id);
        if (!blog) {
             return res.status(404).json({ message: "Blog not found" });
        }

        const user = await getUserbyId(blog.user); // Assuming you have a function to get user by ID
        if (user) {
            const updatedBlogs = user.blogs.filter(blogId => blogId.toString() !== id);
            user.blogs = updatedBlogs;
          
            await editUserBlogs(user);
        }
        const result = await DeleteBlogsbyId(id, deleteBlog)
        console.log(result)
        if(!result.deletedCount<=0){
            return res.status(400).json({message:"error occured"})
        }
        return res.status(201).json({data:blog,status:result})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
})


router.get('/user-blogs/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Call the getUserBlogsByUserId function to retrieve user-specific blogs
        const userBlogs = await getUserBlogsByUserId(userId);
        
        // If userBlogs is null (user not found), return a 404 response
        if (!userBlogs) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Return the fetched user-specific blogs in the response
        res.status(200).json({ userBlogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
export const blog_router = router;