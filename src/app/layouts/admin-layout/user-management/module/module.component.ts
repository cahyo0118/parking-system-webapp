import { APIService } from './../../../../service/api.service';
import { SimplePageable } from './../../../../model/simple-pageable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

  showLoader: boolean = false;
  items = [];
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
    name: 'module-list',
    display_name: 'Module',
    icon: 'fas fa-user-tag'
  };

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
        this.pageData = routeData;
        // this.orderBy = routeData.visibleFields[0].name;
      }
    );

    this.orderBy = this.visibleFields[0].name;

    this.initForm();

    this.activatedRoute.queryParams.subscribe(
      queryParams => {
        this.getAll();
      }
    );

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
        }
      }
    ).then(
      response => {
        this.showLoader = false;

        this.items = response.data.body;
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
    this.router.navigate(
      ['.'],
      {
        relativeTo: this.activatedRoute,
        queryParams: this.pageable,
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
    // this.pageable.goNext();
  }

  goCustom(page: number) {
    this.pageable.goCustom(page);
    this.initQueryParams();
  }

  onVisibilityChange() {
    console.log('onVisibilityChange-formValue', this.visibleFieldForm.value);
    console.log('onVisibilityChange-get', this.visibleFieldForm.controls['name'].value);
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
          `api/modules/${id}/delete`,
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

}
