import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { LawSelectableModal } from './law-selectable/law-selectable-modal.component';
// import { LawSelectableComponent } from './law-selectable/law-selectable.component';
// import { DynamicComponentComponent } from './dynamic-component/dynamic-component.component';
// import { ListComponent } from './dynamic-component/list/list.component';
// import { SingleComponent } from './dynamic-component/single/single.component';
// import { FormComponent } from './dynamic-component/form/form.component';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    // LawSelectableComponent,
    // LawSelectableModal,
    // DynamicComponentComponent,
    // ListComponent,
    // SingleComponent,
    // FormComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    // LawSelectableComponent,
  ]
})
export class ComponentsModule { }
