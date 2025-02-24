import { Component,OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { db, ref, set, push, get } from '../../../firebaseConfig'

@Component({
    selector: 'app-my-component',
    imports: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      MatFormFieldModule, 
      MatInputModule, 
      MatSelectModule,
      FormsModule,
      MatDialogModule,
      MatSelectModule,
    ],
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.css'
})

export class MyComponentComponent implements OnInit {
  recipes: Set<{
    name: string;
    recipe: string;
    fullRecipe: string;
    date: Date;
    imageUrl: string;
    ingredients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  }> = new Set();

  constructor() {
    this.fetchRecipes();
  }

  readRecipe = async(): Promise<Set<{
    name: string;
    recipe: string;
    fullRecipe: string;
    date: Date;
    imageUrl: string;
    ingredients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  }>> => {
    try {
      const snapshot = await get(ref(db, "recipes"));

      return new Set(
        Object.values(snapshot.val()).map((recipe: any) => ({
          ...recipe,
          date: new Date(recipe.date),
          ingredients: recipe.ingredients ?? [],
        }))
      );
    } catch (error) {
      console.error("Ошибка загрузки рецептов:", error);
      return new Set();
    }
  };

  private async fetchRecipes() {
    this.recipes = await this.readRecipe();
  }
  

  units = ['г', 'кг', 'л', 'мл', 'шт', 'ст. ложки'];

  currentRecipe: { name: string; fullRecipe: string } | null = null;
  selectedRecipe: { name: string; recipe: string; fullRecipe: string; date: Date; ingredients: { name: string; amount: number; unit: string; }[];  } | null = null;

    editRecipe(recipe: { name: string; fullRecipe: string; }) {
      this.currentRecipe = { ...recipe };  
    }

    deleteRecipe(recipe: any) {
      Swal.fire({
        title: `Удалить рецепт "${recipe.name}"?`,
        text: "Это действие нельзя отменить!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Да, удалить!",
        cancelButtonText: "Отмена",
      }).then((result) => {
        if (result.isConfirmed) {
          this.recipes.delete(recipe);
          Swal.fire({
            title: "Удалено!",
            text: `Рецепт "${recipe.name}" был удален.`,
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
        }
      });
    }
    saveRecipeHelper() {
      if (this.currentRecipe) {
        const newRec = { ...this.currentRecipe };
        for (let recipe of Array.from(this.recipes)) {
          if (recipe.name === newRec.name) {
            recipe.fullRecipe = newRec.fullRecipe;  
          }
        }
        this.currentRecipe = null; 
      }
    }

    ngOnInit(): void {
      this.addIngredient();
    }

    viewFullRecipe(recipe: { name: string; recipe: string; fullRecipe: string; date: Date; ingredients: { name: string; amount: number; unit: string; }[];  }) {
      this.selectedRecipe = { ...recipe };
    }

    saveRecipe(recipe: any) {
      this.saveRecipeHelper();
      this.viewFullRecipe(recipe);
    }


    closeFullRecipe() {
      this.selectedRecipe = null;
    }

    newRecipe = {
      name: '',
      recipe: '',
      fullRecipe: '',
      date: Date.now(),
      imageUrl: '',
      ingredients: [] as { name: string; amount: number; unit: string }[],
    };
    
    addIngredient() {
      this.newRecipe.ingredients.push({ name: '', amount: 0, unit: '' });
    }

    removeIngredient(index: number) {
      if (this.newRecipe.ingredients.length > 1) {
        this.newRecipe.ingredients.splice(index, 1);
      }
    }

    checkImageUrl(url: string) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(true); 
        img.onerror = () => reject(false); 
      });
    }
    
    createRecipe() {
      if (this.newRecipe.name && this.newRecipe.recipe) {
        this.checkImageUrl(this.newRecipe.imageUrl)
          .then(() => {
            //this.recipes.add({ ...this.newRecipe });
            this.addRecipe(this.newRecipe)
            this.newRecipe = {
              name: '',
              recipe: '',
              fullRecipe: '',
              date: Date.now(),
              imageUrl: '',
              ingredients: [],
            };
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Ошибка!',
              text: 'Некорректный URL изображения, проверьте ссылку!',
              confirmButtonColor: '#d33',
            });
          });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Внимание!',
          text: 'Заполните все обязательные поля!',
          confirmButtonColor: '#f39c12',
        });
      }
    }
    addRecipe = async (newRecipe: any): Promise<void> => {
      try {
        const newRecipeRef = push(ref(db, "recipes"));    
        await set(newRecipeRef, newRecipe);
          } catch (error) {
        console.error("Ошибка при добавлении рецепта:", error);
      }
    };
}
