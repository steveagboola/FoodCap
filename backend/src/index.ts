import 'dotenv/config';
import express from "express";
import cors from "cors";
import * as RecipeAPI from './recipe-api';
import {PrismaClient} from "@prisma/client";

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/recipes/search", async(req, res) =>{
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);
    const results = await RecipeAPI.serchRecipes(searchTerm, page);

    return res.json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) =>{
    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeSummary(recipeId)
    return res.json(results);
});

app.post("/api/recipes/favourite", async (req, res)=> {
    const recipeId = req.body.recipeId;

    try {
      const favouriteRecipe = await prismaClient.favouriteRecipes.create({
        data: {
            recipeId: recipeId
        }
      });
      return res.status(201).json(favouriteRecipe)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "something went wrong"})
        
    }
});

//Create favourites
//This is where it goes to our database to find the rows created and returen favorite recipes to the UI
app.get("/api/recipes/favourite", async (req, res)=>{
    try {
        const recipes =await prismaClient.favouriteRecipes.findMany();
        const recipeId = recipes.map((recipes)=> recipes.recipeId.toString());

        const favourites = await RecipeAPI.getFavouriteRecipesByIDs(recipeId)

        return res.json(favourites);

    } catch (error) {
        
    }
});

//Delete favourites
app.delete("/api/recipes/favourite", async (req, res) => {
    const recipeId = req.body.recipeId;
  
    try {
      await prismaClient.favouriteRecipes.delete({
        where: {
          recipeId: recipeId,
        },
      });
      //204 for new content: means something was deleated?
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Oops, something went wrong" });
    }
  });


 
 
app.listen(8080, ()=> {
    console.log("Server runing 8080") 
});   