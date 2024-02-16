import { AiOutlineHeart } from "react-icons/ai"; //Heart icon 
import { Recipe } from "../types"


interface RecipeProps {
    recipe: Recipe;
    onClick: () => void;
    onFavouriteButtonClick:(recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onClick, onFavouriteButtonClick }: RecipeProps) => {

    return (
        <div className="recipe-card" onClick={onClick}>
            <img src={recipe.image}></img>
            <div className="recipe-card-title">
                <span onClick= {(event)=>{
                    //to ignore onClick on rest of the card
                    event.stopPropagation()
                    onFavouriteButtonClick(recipe);
                }}></span>
                <span>
                    <AiOutlineHeart size={(25)}/>
                </span>
                <h3>{recipe.title} </h3>
            </div>
        </div>
    );


};
export default RecipeCard;
