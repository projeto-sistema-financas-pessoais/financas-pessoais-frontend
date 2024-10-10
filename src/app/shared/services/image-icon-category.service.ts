import { Injectable } from '@angular/core';

export interface IconCategory {
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageIconCategoryService {


  private imageList: IconCategory[] = [
    { fileName: 'transport.svg' },
    { fileName: 'starhappy.svg' },
    { fileName: 'schooll.svg' },
    { fileName: 'run.svg' },
    { fileName: 'salary.svg' },
    { fileName: 'pool.svg' },
    { fileName: 'love.svg' },
    { fileName: 'debt.svg' },

    { fileName: 'pets.svg' },
    { fileName: 'livetv.svg' },
    { fileName: 'home.svg' },
    { fileName: 'health2.svg' },
    { fileName: 'health.svg' },
    { fileName: 'happy2.svg' },
    { fileName: 'happy.svg' },
    { fileName: 'gym.svg' },
    { fileName: 'drink.svg' },
    { fileName: 'food.svg' },
    { fileName: 'fastfood.svg' },
    { fileName: 'family.svg' },
    { fileName: 'extra.svg' },
    { fileName: 'emergency.svg' },
    { fileName: 'devices.svg' },
    { fileName: 'controller.svg' },
    { fileName: 'clearday.svg' },
    { fileName: 'bookmark.svg' },
    { fileName: 'business.svg' },
    { fileName: 'book.svg' },
    { fileName: 'car.svg' } // Adicionado car
  ];


  getImages(): IconCategory[] {
    return this.imageList.map(icon => ({
      ...icon,
      fileName:  icon.fileName
    }));
  }
}
