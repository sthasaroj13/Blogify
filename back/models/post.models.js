import mongoose, { Schema } from "mongoose";
const postSchema  = new mongoose.Schema({
title:{
    type: String,
    required :true,

},
// category:{
//     type: String,
//     required: true,
//     enum : ['Agriculture', 'Business', 'Education', 'Entertainment', 'Art', 'Investment', 'Uncategorized', 'Weather'],
//     message:"value is not supported",

// },
category: {
    type: String,
 
    enum: ['Agriculture', 'Business', 'Education', 'Entertainment', 'Art', 'Investment', 'Uncategorized', 'Weather'],
    
},
description:{
    type: String,
    required :true,

},
thumbnail:{
    type: String,
    required :true,

},
creator:{
    type: Schema.Types.ObjectId,
    ref:'User',
    // required :true,

},


},{timestamps:true})


export const Post = mongoose.model('Post',postSchema)