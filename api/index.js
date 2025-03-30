const express = require('express');
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const cors=require('cors');
const app = express();

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/Main_Blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));
    const UserSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
      });
      
      const User = mongoose.model('User', UserSchema);
      const PostSchema = new mongoose.Schema({
        username: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      });
      
      const Post = mongoose.model("Post", PostSchema);


      const PortfolioSchema = new mongoose.Schema({
        username: { type: String, required: true },
        portfolioLink: { type: String, required: true } 
    });
    
    const Porfoliomodel = mongoose.model("PortfolioLink", PortfolioSchema);

    const LikeSchema = new mongoose.Schema({
      username: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      like: { type: Number, default: 0 }, 
    });

    const LikeCommentModel = mongoose.model("LikeComment", LikeSchema);

    

    app.post('/register', async(req,res)=>{
    const {username,password}=req.body;
    try{
        const existingUser= await User.findOne({username});
        if(existingUser){
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: 'Registration successful' });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
})



app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=await User.findOne({username});
   try{
    if(!user){
        res.status(400).json({message:'user not found'});
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({message:'Invalid password'});
    }
    const userInfo={
      id:user._id,
      username:user.username,
    };
    res.status(200).json({message:'Login successfull',user:userInfo });
   }
   catch(err){
    console.log(err);
    res.status(500).json({message:'Login failed'})
   }
})

app.post('/post', async (req, res) => {
  console.log("Received POST request with:", req.body);
  const { username, userId, title, content } = req.body;
  try {
    console.log("Checking if user exists...");
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId), username });

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("User found! Creating a new post...");
    const newPost = new Post({ username, userId, title, content });

    await newPost.save();
    console.log("Post created successfully:", newPost);

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: 'Failed to create the post', error: err.message });
  }
});


app.put('/updatepost', async (req, res) => {
  const { username, previousTitle, currentTitle, previousContent, currentContent } = req.body;

  try {
      const post = await Post.findOne({ username, title: previousTitle, content: previousContent });

      if (!post) {
          return res.status(404).json({ message: "Post not found or no changes detected" });
      }

      // Update post details
      post.title = currentTitle;
      post.content = currentContent;
      await post.save();

      res.status(200).json({ message: "Post updated successfully", post });
  } catch (err) {
      console.error("Error updating post:", err);
      res.status(500).json({ message: "Failed to update post", error: err.message });
  }
});


app.delete('/deletepost', async (req, res) => {
  const { username, title, content } = req.body;

  try {
    
    const post = await Post.findOneAndDelete({ username, title, content });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Failed to delete the post', error: err.message });
  }
});



app.get('/myposts/:username', async (req, res) => {
  try {
    const username = req.params.username; 
    console.log(`Fetching posts for user: ${username}`);

    const posts = await Post.find({ username }); 

    if (posts.length > 0) {
      console.log("Posts found:", posts); 
      return res.json(posts);
    } else {
      console.log("No posts found for:", username);
      return res.status(404).json({ message: "No posts found" });
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  } 
});

app.get("/allposts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    await Post.aggregate([
      { $addFields: { like: 0 } }, 
      { $merge: { into: "likecomments", whenMatched: "merge", whenNotMatched: "insert" } }
    ]);


    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


app.put('/updatePortfolio', async (req, res) => {
  const { username, portfolioLink } = req.body;
  console.log('update')

  try {
      
      const existingPortfolio = await Porfoliomodel.findOne({ username });

      if (existingPortfolio) {
          
          existingPortfolio.portfolioLink = portfolioLink; 
          await existingPortfolio.save();
          console.log(existingPortfolio)
          return res.status(200).json({ message: 'Portfolio link updated successfully' });
      } else {
          
          const newPortfolio = new Porfoliomodel({
              username,
              portfolioLink 
          });
          console.log(newPortfolio)
          await newPortfolio.save();
          return res.status(201).json({ message: 'Portfolio link created successfully' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update portfolio link' });
  }
});


app.delete('/deletePortfolio', async (req, res) => {
  const { username } = req.body;
  console.log('delete')

  try {
      const portfolioLink = await Porfoliomodel.findOne({ username });

      if (portfolioLink) {
          
          await portfolioLink.deleteOne({ username });
          return res.status(200).json({ message: 'Portfolio link deleted successfully' });
      } else {
          return res.status(404).json({ message: 'Portfolio link not found' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to delete portfolio link' });
  }
});

app.get('/getPortfolio/:username', async (req, res) => {
  const { username } = req.params;
 console.log('get')
  try {
      const portfolio = await Porfoliomodel.findOne({ username }); 
      if (portfolio) {
          return res.status(200).json({ portfolioLink: portfolio.portfolioLink }); 
      } else {
          return res.status(404).json({ message: 'Portfolio link not found' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching portfolio link' });
  }
});



app.post('/like', async (req, res) => {
  const { username, title, content, likes } = req.body;

  try {
    
    let likeEntry = await LikeCommentModel.findOne({ username, title, content });

    if (likeEntry) {
      
      likeEntry.like += likes;

     
      await likeEntry.save();
      res.status(200).json({ message: "Like updated successfully", likeEntry });
    } else {
     
      likeEntry = new LikeCommentModel({
        username,
        title,
        content,
        like: 1,
      });

      
      await likeEntry.save();
      res.status(200).json({ message: "Like added successfully", likeEntry });
    }
  } catch (error) {
    console.error("Error updating/adding like:", error);
    res.status(500).json({ message: "Error updating like", error });
  }
});



app.post('/fix-likes', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    
    const likeComments = await LikeCommentModel.find({ username });

    res.status(200).json({
      message: `Fetched LikeComment data successfully for ${username}`,
      data: likeComments,
      count: likeComments.length, 
    });
  } catch (error) {
    console.error("Error fetching LikeComment data:", error);
    res.status(500).json({ message: "Error fetching LikeComment data", error });
  }
});





module.exports = app;

module.exports = LikeCommentModel;
app.listen(4000,()=>{
    console.log('Server is running on port http://localhost:4000');
});