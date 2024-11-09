import { Injectable } from '@angular/core';

export interface IconCategory {
  fileName: string;
  color: string
}

@Injectable({
  providedIn: 'root'
})
export class ImageIconCategoryService {


  private imageList: IconCategory[] = [
    { fileName: 'transport.svg' , color: '#00A8E1'},
    { fileName: 'starhappy.svg' , color: '#FFEA00'},
    { fileName: 'schooll.svg' , color: '#800080'},
    { fileName: 'run.svg' , color: '#E74C3C'},
    { fileName: 'salary.svg' , color: '#4CAF50'},
    { fileName: 'pool.svg' , color: '#2980B9'},
    { fileName: 'love.svg' , color: '#E91E63'},
    { fileName: 'debt.svg' , color: '#7D3C98'},
    { fileName: 'pets.svg' , color: '#FF5722'},
    { fileName: 'livetv.svg' , color: '#8E44AD'},
    { fileName: 'home.svg' , color: '#2ECC71'},
    { fileName: 'health2.svg' , color: '#16A085'},
    { fileName: 'health.svg' , color: '#F1C40F'},
    { fileName: 'happy2.svg' , color: '#D35400'},
    { fileName: 'happy.svg' , color: '#F39C12'},
    { fileName: 'gym.svg' , color: '#34495E'},
    { fileName: 'drink.svg' , color: '#8E44AD'},
    { fileName: 'food.svg' , color: '#C0392B'},
    { fileName: 'fastfood.svg' , color: '#D50000'},
    { fileName: 'family.svg' , color: '#6A5ACD'},
    { fileName: 'extra.svg' , color: '#FFD700'},
    { fileName: 'emergency.svg' , color: '#E67E22'},
    { fileName: 'devices.svg' , color: '#9B59B6'},
    { fileName: 'controller.svg', color: '#2C3E50' },
    { fileName: 'clearday.svg' , color: '#3498DB'},
    { fileName: 'bookmark.svg' , color: '#F39C12'},
    { fileName: 'business.svg' , color: '#16A085'},
    { fileName: 'book.svg' , color: '#D35400'},
    { fileName: 'car.svg' , color: '#FF4500'} 
  ];


  getImages(): IconCategory[] {
    return this.imageList.map(icon => ({
      ...icon,
      fileName:  icon.fileName
    }));
  }
}
