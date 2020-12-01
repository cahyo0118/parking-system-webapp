import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantComponent } from './tenant/tenant.component';
import { TenantFormComponent } from './tenant-form/tenant-form.component';
import { TenantSingleComponent } from './tenant-single/tenant-single.component';

const routes: Routes = [
  {
    path: 'tenant',
    component: TenantComponent
  },

  {
    path: 'tenant/:id/detail',
    component: TenantSingleComponent,
    children: [

      {
        path: 'community',
        loadChildren: './relations/community/community.module#CommunityModule'
      },

      {
        path: 'admin',
        loadChildren: './relations/community/community.module#CommunityModule'
      },

      {
        path: 'member',
        loadChildren: './relations/community/community.module#CommunityModule'
      },
    ]
  },

  {
    path: 'tenant/create',
    component: TenantFormComponent,
  },

  {
    path: 'tenant/:id/update',
    component: TenantFormComponent,
  },
];

@NgModule({
  declarations: [
    TenantComponent,
    TenantFormComponent,
    TenantSingleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgSelectModule,
  ]
})
export class TenantModule { }
