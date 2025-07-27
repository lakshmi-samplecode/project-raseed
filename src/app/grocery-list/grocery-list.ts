import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-grocery-list',
  standalone: false,
  templateUrl: './grocery-list.html',
  styleUrl: './grocery-list.scss'
})
export class GroceryList {
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  selectedItem: any = {};
  itemList :any[] = [
    {
      category: 'Grocery',
      product: 'Rice',
      quantity: 5,
      unit: 'kg',
      brand: 'India Gate',
      price: 500
    },
    {
      category: 'Grocery',
      product: 'Wheat Flour',
      quantity: 10,
      unit: 'kg',
      brand: 'Aashirvaad',
      price: 450
    },
    {
      category: 'Grocery',
      product: 'Milk',
      quantity: 2,
      unit: 'litres',
      brand: 'Amul',
      price: 120
    },
    {
      category: 'Grocery',
      product: 'Sugar',
      quantity: 2,
      unit: 'kg',
      brand: 'Dhampure',
      price: 90
    },
    {
      category: 'Grocery',
      product: 'Salt',
      quantity: 1,
      unit: 'kg',
      brand: 'Tata',
      price: 30
    },
    {
      category: 'Care',
      product: 'Shampoo',
      quantity: 1,
      unit: 'bottle',
      brand: 'Head & Shoulders',
      price: 180
    },
    {
      category: 'Care',
      product: 'Toothpaste',
      quantity: 2,
      unit: 'tubes',
      brand: 'Colgate',
      price: 120
    },
    {
      category: 'Care',
      product: 'Body Lotion',
      quantity: 1,
      unit: 'bottle',
      brand: 'Nivea',
      price: 220
    },
    {
      category: 'Care',
      product: 'Hand Sanitizer',
      quantity: 2,
      unit: 'bottles',
      brand: 'Dettol',
      price: 100
    }
  ];
  constructor(private dialog: MatDialog){}
  openDialog()  {
    this.dialog.open(this.editDialog, {
      width: '400px',
      data: this.selectedItem
    });
  }
  saveItem(dialogRef: MatDialogRef<any>) {
    console.log('Saved item:', this.selectedItem);
    dialogRef.close();
  }
  increaseQuantity(index: number) {
    this.itemList[index].quantity += 1;
  }
  decreaseQuantity(index: number) {
    if (this.itemList[index].quantity > 1) {
      this.itemList[index].quantity -= 1;
    }
  }
   deleteItem(index: number) {
    this.itemList.splice(index, 1);
  }
  saveList() {
    // Replace with real saving logic, e.g., API call or localStorage
    console.log('Updated item list:', this.itemList);
    alert('Item list saved successfully!');
  }
}