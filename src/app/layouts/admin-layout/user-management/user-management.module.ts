import { NgSelectModule } from '@ng-select/ng-select';
import { UserFormComponent } from './user-form/user-form.component';
import { UserSingleComponent } from './user-single/user-single.component';
import { UserComponent } from './user/user.component';
import { PermissionSingleComponent } from './permission-single/permission-single.component';
import { PermissionFormComponent } from './permission-form/permission-form.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleComponent } from './role/role.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { RoleSingleComponent } from './role-single/role-single.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { ModuleComponent } from './module/module.component';
import { ModuleSingleComponent } from './module-single/module-single.component';
import { ModuleFormComponent } from './module-form/module-form.component';
import { PermissionTableComponent } from './permission-table/permission-table.component';
import { PermissionTableSingleComponent } from './permission-table-single/permission-table-single.component';
import { PermissionTableFormComponent } from './permission-table-form/permission-table-form.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: 'user',
        component: UserComponent,
      },

      {
        path: 'user/:id/detail',
        component: UserSingleComponent,
      },

      {
        path: 'user/create',
        component: UserFormComponent,
      },

      {
        path: 'user/:id/update',
        component: UserFormComponent,
      },

      {
        path: 'role',
        component: RoleComponent,
      },

      {
        path: 'role/:id/detail',
        component: RoleSingleComponent,
      },

      {
        path: 'role/create',
        component: RoleFormComponent,
      },

      {
        path: 'role/:id/update',
        component: RoleFormComponent,
      },

      {
        path: 'module',
        component: ModuleComponent,
      },

      {
        path: 'module/:id/detail',
        component: ModuleSingleComponent,
        children: [
          {
            path: 'permission',
            component: PermissionTableComponent,
          },

          {
            path: 'permission/:permission_id/detail',
            component: PermissionTableSingleComponent,
          },

          {
            path: 'permission/create',
            component: PermissionTableFormComponent,
          },

          {
            path: 'permission/:permission_id/update',
            component: PermissionTableFormComponent,
          },
        ]
      },

      {
        path: 'module/create',
        component: ModuleFormComponent,
      },

      {
        path: 'module/:id/update',
        component: ModuleFormComponent,
      },

      {
        path: 'permission',
        component: PermissionComponent,
      },

      {
        path: 'permission/:id/detail',
        component: PermissionSingleComponent,
      },

      {
        path: 'permission/create',
        component: PermissionFormComponent,
      },

      {
        path: 'permission/:id/update',
        component: PermissionFormComponent,
      },

    ]
  },
];

@NgModule({
  declarations: [
    UserManagementComponent,
    UserComponent,
    UserSingleComponent,
    UserFormComponent,
    RoleComponent,
    RoleSingleComponent,
    RoleFormComponent,
    RolePermissionComponent,
    ModuleComponent,
    ModuleSingleComponent,
    ModuleFormComponent,
    PermissionComponent,
    PermissionSingleComponent,
    PermissionFormComponent,
    PermissionTableComponent,
    PermissionTableSingleComponent,
    PermissionTableFormComponent,
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
export class UserManagementModule { }
