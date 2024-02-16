import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as RecipeAPI from '../api'


interface Props {
    recipeId: string;
    onClose: () => void;
  }

const RecipeModal = ({recipeId, onClose}: Props) => {
    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary | null>(null);

    useEffect(() => {
        const fetchRecipeSummary = async () => {
          try {
            const summaryRecipe = await RecipeAPI.getRecipeSummary(recipeId);
            setRecipeSummary(summaryRecipe);
          } catch (error) {
            console.log(error);
          }
          };

          fetchRecipeSummary();
        },[recipeId]);


        // if (!recipeSummary) {
        //     return <></>;
        
    return (
        <>
          <div className="overlay" onClick={onClose}></div>
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{recipeSummary?.title}</h2>
                <span className="close-btn" onClick={onClose}>&times;</span>
              </div>
              {/* Redit said not to use unless you really trust api.  I want to display the HTML from the API */}
              <p dangerouslySetInnerHTML={{ __html: recipeSummary?.summary || '' }}></p>
            </div>
          </div>
        </>
    );
};

    
    export default RecipeModal;