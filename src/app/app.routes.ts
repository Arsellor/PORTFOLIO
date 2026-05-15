import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Contact } from './contact/contact';
import { Tree } from './tree/tree';
import { Competences } from './competences/competences';
import { Projets } from './projets/projets';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contact', component: Contact }, // Supprimez la virgule en trop ici
  { path: 'competences', component: Competences },
  { path: 'projets', component: Projets },
  { path: 'tree', component: Tree },
  { path: '**', redirectTo: '' }
];