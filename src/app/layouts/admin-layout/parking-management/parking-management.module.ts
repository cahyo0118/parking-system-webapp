import { NgSelectModule } from '@ng-select/ng-select';
import { ParkingManagementComponent } from './parking-management.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import 'moment/locale/id';
import { MomentModule } from 'ngx-moment';
import { GateComponent } from './gate/gate.component';
import { GateSingleComponent } from './gate-single/gate-single.component';
import { GateFormComponent } from './gate-form/gate-form.component';
import { ParkingComponent } from './parking/parking.component';
import { ParkingFeeComponent } from './parking-fee/parking-fee.component';
import { ParkingSingleComponent } from './parking-single/parking-single.component';
import { ParkingListComponent } from './parking-list/parking-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ParkingManagementComponent,
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
        path: 'parking',
        component: ParkingComponent,
      },

      {
        path: 'parking-list',
        component: ParkingListComponent,
      },

      {
        path: 'parking/:id/detail',
        component: ParkingSingleComponent,
      },

      {
        path: 'parking-fee',
        component: ParkingFeeComponent,
      },

    ]
  },
];

@NgModule({
  declarations: [
    ParkingManagementComponent,
    GateComponent,
    GateFormComponent,
    GateSingleComponent,
    ParkingComponent,
    ParkingListComponent,
    ParkingSingleComponent,
    ParkingFeeComponent,
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
  ]
})
export class ParkingManagementModule { }
