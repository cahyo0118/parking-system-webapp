import { APIService } from './../../../../service/api.service';
import { SimplePageable } from './../../../../model/simple-pageable';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {

  @Input() role: any;

  @Input() filters: any;

  showLoader: boolean = false;
  modules = [];
  pageable: SimplePageable = new SimplePageable;
  pageData: any;

  searchForm: FormGroup;
  visibleFieldForm: FormGroup;

  orderBy: any;
  orderType: 'asc' | 'desc' = 'desc';

  visibleFields = [
    {
      name: 'name',
      display_name: 'Name',
      validators: [
        'required'
      ]
    },
    {
      name: 'display_name',
      display_name: 'Display Name',
      validators: [
        'required'
      ]
    },
    {
      name: 'description',
      display_name: 'Description',
      validators: []
    },
  ];

  menu = {
    name: 'permission-list',
    display_name: 'Permission',
    icon: 'fas fa-tasks'
  };

  selected_permissions = [];
  is_permit_all: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {

        console.log('routeData', routeData);
        this.pageData = routeData;
        // this.orderBy = routeData.visibleFields[0].name;
      }
    );

    this.activatedRoute.queryParams.subscribe(
      queryParams => {
        this.filters = queryParams;
      }
    );

    this.orderBy = this.visibleFields[0].name;

    this.initForm();

    this.activatedRoute.queryParams.subscribe(
      queryParams => {
        this.getAll();
      }
    );

    console.log('role', this.role);

  }

  getAll() {
    this.showLoader = true;

    const requestData = JSON.parse(JSON.stringify(this.searchForm.value));

    this.apiService.get(
      `api/modules`,
      {
        params: {
          keyword: requestData.keyword,
          limit: this.pageable.limit,
          offset: this.pageable.offset,
          orderBy: this.orderBy,
          orderType: this.orderType,
          filters: this.filters,
          with: [
            'permissions'
          ]
        }
      }
    ).then(
      response => {
        this.showLoader = false;

        this.modules = response.data.body;

        this.pageable.setValue(
          this.pageable.limit,
          this.pageable.offset,
          response.data.form,
          response.data.to,
          response.data.total,
        );

      },
      error => {
        this.showLoader = false;
      }
    );
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      'keyword': [''],
    });

    if (this.visibleFields) {

      this.visibleFieldForm = this.formBuilder.group({});

      this.visibleFields.forEach(visibleField => {
        this.visibleFieldForm.addControl(visibleField.name, new FormControl(true, []));
      });

    }
  }

  initQueryParams() {
    this.getAll();

    this.router.navigate(
      ['.'],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.filters,
      }
    );
  }

  toggleOrder(fieldName) {

    if (this.orderBy == fieldName) {
      this.orderType = (this.orderType == 'desc') ? 'asc' : 'desc';
    }

    this.orderBy = fieldName;

    this.initQueryParams();

    this.getAll();
  }

  goToPreviousPage() {
    this.pageable.goPrevious();
    this.initQueryParams();
  }

  goToFirstPage() {
    this.pageable.goFirst();
    this.initQueryParams();
  }

  goToNextPage() {
    this.pageable.goNext();
    this.initQueryParams();

  }

  goToLastPage() {
    this.pageable.goLast();
    this.initQueryParams();
  }

  goCustom(page: number) {
    this.pageable.goCustom(page);
    this.initQueryParams();
  }

  onDelete(id) {

    Swal.fire({
      title: 'Delete data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        this.spinner.show();
        this.apiService.delete(
          `api/permissions/${id}/delete`,
          null
        ).then(
          response => {
            this.spinner.hide();

            Swal.fire(
              'Success!',
              response.data.message,
              'success'
            );

            this.getAll();

          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Failed!',
              error.response.data.message,
              'error'
            );
          }
        );

      }

    });

  }

  onSubmit() {

    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        const requestData = {
          is_permit_all: this.is_permit_all,
          permissions: this.selected_permissions
        };

        this.spinner.show();
        this.apiService.put(
          `api/roles/${this.role.id}/update-permissions`,
          requestData
        ).then(
          response => {
            this.spinner.hide();

            Swal.fire(
              'Success!',
              response.data.message,
              'success'
            );

          },
          error => {
            this.spinner.hide();

            Swal.fire(
              'Failed!',
              error.response.data.message,
              'error'
            );
          }
        );
      }

    });

  }

  setData(data) {
    this.role = data;
    this.is_permit_all = this.role.is_permit_all;
    this.selected_permissions = this.role.permissions;
  }

  // Permission
  onPermitAll() {
    this.is_permit_all = !this.is_permit_all;
  }

  isModulePermitted(module_id, permissions_count): boolean {
    let count = this.selected_permissions.filter(moduleObject => moduleObject.module_id == module_id).length;
    return count === permissions_count;
  }

  onPermitModule(module_id, permissions_count) {

    console.log('onPermitModule', module_id, permissions_count);

    let selectedPermissionsCount = this.selected_permissions.filter(moduleObject => moduleObject.module_id == module_id).length;

    const module = this.modules.find(moduleObject => moduleObject.id == module_id);

    if (typeof module !== 'undefined') {
      if (selectedPermissionsCount < permissions_count) {

        module.permissions.forEach(permission => {
          if (typeof this.selected_permissions.find(currentPermission => currentPermission.id == permission.id) === 'undefined') {
            this.selected_permissions.push(permission);
          }
        });


      } else {

        this.selected_permissions = this.selected_permissions.filter(moduleObject => moduleObject.module_id != module_id);

      }
    }

    console.log('this.selectedPermissions', this.selected_permissions);

  }

  isPermitted(permission_id): boolean {
    return typeof this.selected_permissions.find(permission => permission.id == permission_id) !== 'undefined';
  }

  onPermit(permission) {
    const selectedPermissionIndex = this.selected_permissions.findIndex((selectedPermission) => selectedPermission.id == permission.id);

    if (selectedPermissionIndex < 0) {
      this.selected_permissions.push(permission);
    } else {
      this.selected_permissions.splice(selectedPermissionIndex, 1);
    }

  }


}
