import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// We define routes here for migration analysis, even though the app 
// currently uses a hidden-toggle shell to maximize DOM stress.
export const routes: Routes = [
  { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
  { path: 'settings-audit', children: [
    { path: 'security', redirectTo: '' },
    { path: 'logs', redirectTo: '' }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
