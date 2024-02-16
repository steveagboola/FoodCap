
import "./App.css";
import { FormEvent, useState, useRef, useEffect } from "react";
import * as api from './api';
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";

type Tabs = "search" | "favourites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>();
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef<number>(1);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const data = await api.getFavouriteRecipes();
        if (data && data.results) {
          setFavouriteRecipes(data.results);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavouriteRecipes();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    pageNumber.current = 1;
    try {
      const fetchedRecipes = await api.searchRecipes(searchTerm, pageNumber.current);
      if (fetchedRecipes && fetchedRecipes.results) {
        setRecipes(fetchedRecipes.results);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      if (nextRecipes && nextRecipes.results) {
        setRecipes((prevRecipes) => [...prevRecipes, ...nextRecipes.results]);
        pageNumber.current = nextPage;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavouriteRecipe(recipe);
      setFavouriteRecipes((prevFavourites) => [...prevFavourites, recipe]);
    } catch (error) {
      console.error(error);
    }
  };

  const onClose = () => setSelectedRecipe(undefined);

  return (
    <div>
      <div className="tabs">
        <h1 onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setSelectedTab("favourites")}>Favourite Recipes</h1>
      </div>
      {selectedTab === "search" && (
        <>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              required
              placeholder="Enter a search term ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={() => addFavouriteRecipe(recipe)}
            />
          ))}
          {recipes.length > 0 && (
            <button className="view-more-button" onClick={handleViewMoreClick}>
              View More
            </button>
          )}
        </>
      )}
      {selectedTab === "favourites" && (
        <div>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={() => addFavouriteRecipe(recipe)}
            />
          ))}
        </div>
      )}
      {selectedRecipe && (
        <RecipeModal recipeId={selectedRecipe.id.toString()} onClose={onClose} />
      )}
    </div>
  );
};

export default App;











// import "./App.css";
// import { FormEvent, useState, useRef, useEffect } from "react";
// import * as api from './api'; 
// import { Recipe } from "./types"; 
// import RecipeCard from "./components/RecipeCard"; 
// import RecipeModal from "./components/RecipeModal"; 

// //Cool way to set Tab to only be one or the other
// type Tabs = "search" | "favourites";

// const App = () => {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);

//   const [selectedTab, setSelectedTab] = useState<Tabs>("search");
//   const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([])
 

// //dont want to use useState. Document says use useRef instead (keeping track of page user is on)
// // useRef does not cause a rerender
//   const pageNumber = useRef<number>(1);

//   useEffect(() => {
//     const fetchFavouriteRecipes = async () => {
//       try {
//         const favouriteRecipes = await api.getFavouriteRecipes();
//         setFavouriteRecipes(favouriteRecipes.results);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchFavouriteRecipes();
//   }, []);


//   const handleSearchSubmit = async (event: FormEvent) => {
//     event.preventDefault();
//     pageNumber.current = 1; // Reset to first page on new search
//     try {
//       const fetchedRecipes = await api.searchRecipes(searchTerm, pageNumber.current);
//       setRecipes(fetchedRecipes.results);
//     } catch (e) {
//       console.error(e);
//     }
//   };


// //For viewing more pages without leaving current page
// // Have to use .current to get current page then the plus 1
//   const handleViewMoreClick = async () => {
//     const nextPage = pageNumber.current + 1;
//     try {
//       const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
//       setRecipes(prevRecipes => [...prevRecipes, ...nextRecipes.results]);
//       pageNumber.current = nextPage; // Update current page
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const addFavouriteRecipe = async (recipe: Recipe) => {
//     try {
//       await api.addFavouriteRecipe(recipe);
//       setFavouriteRecipes([...favouriteRecipes, recipe]);
//     } catch (error) {
//       console.log(error);
//     }
//   };



//   const onClose = () => {
//     setSelectedRecipe(undefined); // Closes the modal
//   };

//   return (
//     <div>
//       <div className="tabs">
//         <h1 onClick={() => setSelectedTab("search")}> Recipe Search</h1>
//         <h1 onClick={() => setSelectedTab("favourites")}> Favourite Search</h1>
//       </div>
//       {selectedTab === "search" && (<>
//         <form onSubmit={handleSearchSubmit}>
//         <input
//           type="text"
//           required
//           placeholder="Enter a search term ..."
//           value={searchTerm}
//           onChange={(event) => setSearchTerm(event.target.value)}
//         />
//         <button type="submit">Submit</button>
//       </form>

//       {recipes.map((recipe) => (
//         <RecipeCard key={recipe.id} 
//         recipe={recipe} 
//         onClick={() => setSelectedRecipe(recipe)} 
//         onFavouriteButtonClick={addFavouriteRecipe}
//         />
//       ))}

//       {recipes.length > 0 && (
//         <button className="view-more-button" onClick={handleViewMoreClick}>
//           View More
//         </button>
//       )}
      
//       </>)}

//       {selectedTab === "favourites" && (
//         <div>
//           {favouriteRecipes.map((recipe) => (
//             <RecipeCard 
//               key={recipe.id}
//               recipe={recipe}
//               onClick={() => setSelectedRecipe(recipe)} 
//               onFavouriteButtonClick={() => undefined}/>
//           ))}
//         </div>
//       ) }


//       {selectedRecipe && (
//         <RecipeModal recipeId={selectedRecipe.id.toString()} onClose={onClose} />
//       )}
//     </div>
//   );
// };

// export default App;
















// import "./App.css"
// import { FormEvent, useState } from "react";
// import * as api from './api';
// import { Recipe } from "./types";
// import RecipeCard from "./components/RecipeCard";
// import RecipeModal from "./components/RecipeModal";



// const App = () => {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   //if there is no selected Recipe it will be undefined
//   const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
//     undefined
//   );
// //   //dont want to use useState. Document says use useRef instead (keeping track of page user is on)
// //   // useRef does not cause a rerender
// //   const pageNumber = useRef(1);


//   const handleSearchSubmit = async (event: FormEvent) => {
//     event.preventDefault();
//     try {
//       const recipes = await api.searchRecipes(searchTerm, 1);
//       setRecipes(recipes.results);
//       // pageNumber.current = 1;
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   //For viewing more pages without leaving current page
//   // Have to use .current to get current page then the plus 1
//   // const handleViewMoreClick = async () => {
//   //   const nextPage = pageNumber.current + 1;
//   //   try {
//   //     const nextRecipes = await api.searchRecipes(searchTerm,nextPage )
//   //     //coppies the current recipes, copies the next page of recipes and save that to state
//   //     setRecipes([...recipes, ...nextRecipes.results])
//   //     // Save current page number
//   //     pageNumber.current = nextPage;
//   //   } catch (error) {
//   //     console.log(error);

//   const onClose = () => {
//     setSelectedRecipe(undefined); // Correctly implement the onClose function
//   };

//   return (
  
//     <div>
//             <form onSubmit={handleSearchSubmit}>
//        {/* <form onSubmit={(event) => handleSearchSubmit(event)}> */}
//         <input 
//         type="text" 
//         required 
//         placeholder="Enter a search term ..."
//         value={searchTerm}
//         onChange={(event)=> setSearchTerm(event.target.value)}
//         ></input>
//         <button type="submit">Submit</button>
        
//       </form>  
      

//       {recipes.map((recipe) => (
//   <RecipeCard key={recipe.id} recipe={recipe} onClick={()=> setSelectedRecipe(recipe)}/>
//         // Use recipe.id if your items have a unique id, otherwise use index
//         //   <RecipeCard key={recipe.id} recipe={recipe}/>

//       ))}
//        {/* <button className= "view-more-button" onClick={handleViewMoreClick}>
//         View More
//       </button> */}

//       {/* {selectedRecipe ?( 
//       <RecipeModal recipeId={selectedRecipe.id.toString()} 
//       onClose={function (): void {
//         throw new Error("Function not implemented.");
//       } }/>
//       ) : null} */}

// {selectedRecipe && (
//         <RecipeModal recipeId={selectedRecipe.id.toString()} onClose={onClose}/>
//       )}

//     </div>
      
//   );
// };

// export default App;








