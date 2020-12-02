import { NgSelectModule } from '@ng-select/ng-select';
import { CommunityFormComponent } from './community-form/community-form.component';
import { CommunitySingleComponent } from './community-single/community-single.component';
import { CommunityComponent } from './community/community.component';
import { CommunityManagementComponent } from './community-management.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import 'moment/locale/id';
import { MomentModule } from 'ngx-moment';
import { NgxAutocomPlaceModule } from 'ngx-autocom-place'
import { GateComponent } from './gate/gate.component';
import { GateSingleComponent } from './gate-single/gate-single.component';
import { GateFormComponent } from './gate-form/gate-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CommunityManagementComponent,
    children: [
      {
        path: 'gate',
        component: GateComponent,
      },

      {
        path: 'gate/:id/detail',
        component: GateSingleComponent,
      },

      {
        path: 'gate/create',
        component: GateFormComponent,
      },

      {
        path: 'gate/:id/update',
        component: GateFormComponent,
      },

      {
        path: 'community',
        component: CommunityComponent,
      },

      {
        path: 'community/:id/detail',
        component: CommunitySingleComponent,
      },

      {
        path: 'community/create',
        component: CommunityFormComponent,
      },

      {
        path: 'community/:id/update',
        component: CommunityFormComponent,
      },
    ]
  },
];

@NgModule({
  declarations: [
    CommunityManagementComponent,
    GateComponent,
    GateFormComponent,
    GateSingleComponent,
    CommunityComponent,
    CommunityFormComponent,
    CommunitySingleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgSelectModule,
    InfiniteScrollModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    }),
    NgxAutocomPlaceModule
  ]
})
export class CommunityManagementModule { }
