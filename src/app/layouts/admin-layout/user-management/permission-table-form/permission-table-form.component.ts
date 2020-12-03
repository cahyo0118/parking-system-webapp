import { APIService } from './../../../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-permission-table-form',
  templateUrl: './permission-table-form.component.html',
  styleUrls: ['./permission-table-form.component.css']
})
export class PermissionTableFormComponent implements OnInit {

  id: any;

  showLoader: boolean = false;
  items = [];
  pageData: any;

  filters: any;

  // Relations 
  modules = [];

  form: FormGroup;
  visibleFieldForm: FormGroup;
  visibleFields = [];

  actions = [];

  isUpdate: boolean = false;

  menu = {
    name: 'permission-table-form',
    display_name: 'Permission',
    icon: 'fas fa-user-tag'
  };

  limit = 10;
  offset = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public location: Location,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        console.log('routeData', routeData);
        this.pageData = routeData;
      }
    );

    this.activatedRoute.queryParams.subscribe(
      queryParams => {
        this.filters = queryParams;
      }
    );

    this.initForm();

    const params = this.activatedRoute.snapshot.params;

    if (params.permission_id) {
      this.isUpdate = true;
      this.id = params.permission_id;

      this.getData();

    } else {
      this.isUpdate = false;
    }

    this.getAllModules(0);

  }

  initForm() {

    this.form = this.formBuilder.group({
      module_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      description: ['', []],
    });

    this.form.patchValue(this.filters);

  }

  getData() {
    this.apiService.get(
      `api/permissions/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.form.patchValue(responseBody);
      }
    );
  }

  onSubmit() {

    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        const requestData = JSON.parse(JSON.stringify(this.form.value));

        if (this.isUpdate) {
          this.spinner.show();
          this.apiService.put(
            `api/permissions/${this.id}/update`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

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
        } else {
          this.spinner.show();
          this.apiService.post(
            `api/permissions/store`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

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
      }

    });

  }

  // Relations 
  getAllModules(offset = this.offset) {

    this.apiService.get(
      `api/modules`,
      {
        params: {
          limit: this.limit,
          offset: offset,
          // orderBy: this.orderBy,
          // orderType: this.orderType,
          // filters: this.filters
        }
      }
    ).then(
      response => {
        this.showLoader = false;

        const responseBody = response.data.body;

        console.log('responseBody', responseBody)

        if (responseBody.length > 0) {
          this.offset = offset;
        }

        if (this.offset < 1) {
          this.modules = responseBody;
        } else {
          this.modules = this.modules.concat(responseBody);
        }

        console.log('this.modules', this.modules);

        this.form.controls.module_id.updateValueAndValidity();

      },
      error => {
        this.showLoader = false;
      }
    );
  }

}
