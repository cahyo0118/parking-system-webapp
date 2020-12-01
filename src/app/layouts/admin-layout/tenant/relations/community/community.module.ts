import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityTableComponent } from './community-table/community-table.component';
import { CommunityFormComponent } from './community-form/community-form.component';
import { CommunitySingleComponent } from './community-single/community-single.component';


const routes: Routes = [
  {
    path: '',
    component: CommunityTableComponent
  },

  {
    path: 'create',
    component: CommunityFormComponent,
  },

  {
    path: ':communityId/detail',
    component: CommunitySingleComponent,
  },

  {
    path: ':communityId/update',
    component: CommunityFormComponent,
  },
];


@NgModule({
  declarations: [
    CommunityTableComponent,
    CommunityFormComponent,
    CommunitySingleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ]
})
export class CommunityModule { }
