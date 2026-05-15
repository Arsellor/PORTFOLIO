import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  imports: [],
  templateUrl: './tree.html',
  styleUrls: ['./tree.css']
})
export class Tree implements OnInit {

  ngOnInit(): void {
    // Vérifie que createTree existe avant d'appeler
    if (typeof (window as any)['createTree'] === 'function') {
      new (window as any)['createTree']();
    } else {
      console.warn('createTree is not defined. Make sure the script is loaded in index.html.');
    }
  }
}
